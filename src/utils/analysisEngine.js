// =============================================
// ResumeForge AI — Analysis Engine
// =============================================
import { STOP_WORDS, SKILL_CATEGORIES } from './constants';

export function performAnalysis(resumes, jdText) {
  const jdWords = tokenize(jdText);
  const jdKeywords = extractKeywords(jdWords, jdText);
  const jdSkills = categorizeSkills(jdKeywords);
  const roleInfo = detectRole(jdText);
  const hiddenKeywords = extractHiddenKeywords(jdText);

  // Score each resume
  const resumeScores = resumes
    .map((resume, idx) => {
      if (!resume || !resume.parsed) return null;

      const resumeKeywordsSet = new Set(
        tokenize(resume.text).map((w) => w.toLowerCase())
      );
      const strongMatches = [];
      const weakMatches = [];

      jdKeywords.forEach((kw) => {
        const kwLower = kw.toLowerCase();
        if (
          resumeKeywordsSet.has(kwLower) ||
          resume.text.toLowerCase().includes(kwLower)
        ) {
          strongMatches.push(kw);
        } else {
          weakMatches.push(kw);
        }
      });

      const score =
        jdKeywords.length > 0
          ? Math.round((strongMatches.length / jdKeywords.length) * 100)
          : 0;

      return { index: idx, name: resume.name, text: resume.text, score, strongMatches, weakMatches };
    })
    .filter(Boolean);

  if (resumeScores.length === 0) {
    return { error: 'No valid resumes to analyze.' };
  }

  resumeScores.sort((a, b) => b.score - a.score);
  const best = resumeScores[0];
  const confidence = best.score >= 65 ? 'High' : best.score >= 40 ? 'Medium' : 'Low';

  let whyReason = '';
  if (resumeScores.length === 1) {
    whyReason = `Only one resume was uploaded. It matches ${best.score}% of the extracted JD keywords.`;
  } else {
    const second = resumeScores[1];
    whyReason = `This resume scored ${best.score}% keyword match vs ${second.score}% for "${second.name}". `;
    whyReason +=
      best.score - second.score > 15
        ? 'It has significantly stronger alignment with the JD requirements.'
        : 'Both resumes are close, but this one has marginally better alignment with key technical requirements.';
  }

  const changes = generateChanges(best, jdKeywords, jdSkills, best.weakMatches, roleInfo);
  const risks = generateRisks(best);

  return {
    bestResume: best.name,
    confidence,
    whyReason,
    score: best.score,
    roleInfo,
    hiddenKeywords,
    jdKeywords,
    jdSkills,
    strongMatches: best.strongMatches,
    weakMatches: best.weakMatches,
    changes,
    risks,
    allScores: resumeScores,
  };
}

// ===== TOKENIZE =====
function tokenize(text) {
  return text
    .replace(/[^\w\s\-\.#\+\/]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

// ===== KEYWORD EXTRACTION =====
function extractKeywords(words, rawText) {
  const freq = {};
  words.forEach((w) => {
    const lower = w.toLowerCase();
    if (STOP_WORDS.has(lower) || lower.length <= 2) return;
    const isKnown = Object.values(SKILL_CATEGORIES).some((cat) =>
      cat.includes(lower)
    );
    freq[lower] = (freq[lower] || 0) + (isKnown ? 5 : 1);
  });

  const joinedText = words.join(' ').toLowerCase();
  Object.values(SKILL_CATEGORIES).forEach((cat) => {
    cat.forEach((skill) => {
      if (skill.includes(' ') && joinedText.includes(skill)) {
        freq[skill] = (freq[skill] || 0) + 5;
      }
    });
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word]) => word);
}

// ===== CATEGORIZE SKILLS =====
function categorizeSkills(keywords) {
  const result = {};
  keywords.forEach((kw) => {
    const kwLower = kw.toLowerCase();
    for (const [cat, skills] of Object.entries(SKILL_CATEGORIES)) {
      if (skills.includes(kwLower)) {
        if (!result[cat]) result[cat] = [];
        if (!result[cat].includes(kw)) result[cat].push(kw);
      }
    }
  });
  return result;
}

// ===== ROLE DETECTION =====
function detectRole(jdText) {
  let seniority = 'Not specified';
  if (/\b(intern|internship|co-?op)\b/i.test(jdText)) seniority = 'Intern / Entry Level';
  else if (/\b(junior|jr\.?|entry[- ]level|graduate|new grad)\b/i.test(jdText)) seniority = 'Junior / Entry Level';
  else if (/\b(mid[- ]?level|mid[- ]?senior|intermediate)\b/i.test(jdText)) seniority = 'Mid-Level';
  else if (/\b(senior|sr\.?|lead|principal|staff)\b/i.test(jdText)) seniority = 'Senior';
  else if (/\b(manager|director|vp|head of|chief)\b/i.test(jdText)) seniority = 'Management';

  let role = 'Software Engineering';
  if (/\b(frontend|front[- ]end|ui|ux)\b/i.test(jdText)) role = 'Frontend Development';
  else if (/\b(backend|back[- ]end|server[- ]side|api)\b/i.test(jdText)) role = 'Backend Development';
  else if (/\b(full[- ]?stack|fullstack)\b/i.test(jdText)) role = 'Full Stack Development';
  else if (/\b(devops|site reliability|sre|infrastructure|platform)\b/i.test(jdText)) role = 'DevOps / Infrastructure';
  else if (/\b(data engineer|data science|machine learning|ml engineer|ai)\b/i.test(jdText)) role = 'Data / ML Engineering';
  else if (/\b(mobile|ios|android|react native|flutter)\b/i.test(jdText)) role = 'Mobile Development';
  else if (/\b(cloud|aws|azure|gcp)\b/i.test(jdText)) role = 'Cloud Engineering';
  else if (/\b(qa|quality assurance|test|testing|sdet)\b/i.test(jdText)) role = 'QA / Testing';

  let industry = 'Technology';
  if (/\b(fintech|finance|banking|payment|trading)\b/i.test(jdText)) industry = 'FinTech / Finance';
  else if (/\b(health|medical|pharma|biotech|healthcare)\b/i.test(jdText)) industry = 'Healthcare / Biotech';
  else if (/\b(ecommerce|e-commerce|retail|marketplace)\b/i.test(jdText)) industry = 'E-Commerce / Retail';
  else if (/\b(education|edtech|learning|lms)\b/i.test(jdText)) industry = 'EdTech';
  else if (/\b(gaming|game|entertainment)\b/i.test(jdText)) industry = 'Gaming / Entertainment';
  else if (/\b(saas|b2b|enterprise)\b/i.test(jdText)) industry = 'SaaS / Enterprise';
  else if (/\b(social|media|content|advertising)\b/i.test(jdText)) industry = 'Social Media / AdTech';

  const coreReqs = [];
  const reqPatterns = [
    /(?:required|must have|essential|mandatory)[:\s]+([^.;]+)/gi,
    /(?:proficien(?:t|cy)|expertise|deep knowledge)[:\s]+(?:in\s+)?([^.;]+)/gi,
    /(?:experience with|hands-on with|working knowledge of)[:\s]+([^.;]+)/gi,
  ];
  reqPatterns.forEach((pat) => {
    let match;
    while ((match = pat.exec(jdText)) !== null) {
      coreReqs.push(match[1].trim().substring(0, 100));
    }
  });

  return { role, seniority, industry, coreRequirements: coreReqs.slice(0, 5) };
}

// ===== HIDDEN KEYWORDS =====
function extractHiddenKeywords(jdText) {
  const hidden = [];
  const patterns = [
    { regex: /\b(cross[- ]?functional)\b/gi, keyword: 'cross-functional collaboration' },
    { regex: /\b(ownership|end[- ]to[- ]end)\b/gi, keyword: 'end-to-end ownership' },
    { regex: /\b(fast[- ]?paced|startup|agile environment)\b/gi, keyword: 'fast-paced environment' },
    { regex: /\b(scalab|high[- ]?traffic|performance|optimize)\b/gi, keyword: 'scalability & performance' },
    { regex: /\b(mentor|code review|pair programming)\b/gi, keyword: 'mentoring & code review' },
    { regex: /\b(product[- ]?minded|user[- ]?facing|customer[- ]?centric)\b/gi, keyword: 'product-minded engineering' },
    { regex: /\b(best practices|clean code|code quality|standards)\b/gi, keyword: 'engineering best practices' },
    { regex: /\b(autonomous|independent|self[- ]?starter|self[- ]?directed)\b/gi, keyword: 'autonomous self-starter' },
    { regex: /\b(data[- ]?driven|metrics|analytics|kpi)\b/gi, keyword: 'data-driven decision making' },
    { regex: /\b(collaborative|team[- ]?player|cross[- ]?team)\b/gi, keyword: 'collaborative team player' },
    { regex: /\b(deadline|time[- ]?sensitive|delivery|ship)\b/gi, keyword: 'deadline-driven delivery' },
    { regex: /\b(innovati|creative solution|novel approach)\b/gi, keyword: 'innovative problem solver' },
  ];

  const seen = new Set();
  patterns.forEach(({ regex, keyword }) => {
    if (regex.test(jdText) && !seen.has(keyword)) {
      hidden.push(keyword);
      seen.add(keyword);
    }
  });
  return hidden;
}

// ===== CHANGE GENERATION =====
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function generateChanges(best, jdKeywords, jdSkills, weakMatches, roleInfo) {
  const changes = [];
  const resumeText = best.text;

  const hasSummary = /(?:summary|objective|profile|about me)/i.test(resumeText);
  const summarySection = hasSummary ? 'Executive Summary / Objective' : 'Add Executive Summary';

  const missingSkills = weakMatches
    .filter((w) => Object.values(SKILL_CATEGORIES).some((cat) => cat.includes(w.toLowerCase())))
    .slice(0, 6);
  const matchedSkills = Object.values(jdSkills).flat().slice(0, 4);

  const allSkills = [...new Set([...matchedSkills, ...missingSkills])].slice(0, 5).map(capitalize);
  const summaryText = `Results-driven ${roleInfo.seniority || 'aspiring'} ${roleInfo.role} ${roleInfo.seniority.includes('Intern') ? 'candidate' : 'professional'} with hands-on experience in ${allSkills.slice(0, 3).join(', ')}${allSkills.length > 3 ? `, and ${allSkills[3]}` : ''}. Passionate about building scalable, high-quality software solutions. Eager to contribute to ${roleInfo.industry || 'innovative technology'} teams through strong problem-solving skills and a commitment to engineering best practices.`;

  changes.push({
    section: summarySection,
    action: hasSummary ? 'Replace' : 'Add',
    details: [{ label: hasSummary ? 'Replace full section with' : 'Add new section at top', content: summaryText, type: 'new' }],
    reason: `Align summary with ${roleInfo.role} positioning. Incorporates key JD terms: ${matchedSkills.slice(0, 3).join(', ')}.`,
  });

  // Skills section
  const hasSkillsSection = /(?:skills|competencies|technical skills|technologies|tech stack)/i.test(resumeText);
  const skillsToAdd = weakMatches
    .filter((w) => Object.values(SKILL_CATEGORIES).some((cat) => cat.includes(w.toLowerCase())))
    .slice(0, 8);

  if (skillsToAdd.length > 0) {
    changes.push({
      section: hasSkillsSection ? 'Technical Skills / Core Competencies' : 'Add Technical Skills Section',
      action: skillsToAdd.length > 4 ? 'Replace' : 'Add',
      details: [{ label: 'Add these skills (only if you genuinely possess them)', content: skillsToAdd.map(capitalize).join(', '), type: 'new' }],
      reason: 'These skills appear in the JD but are missing from your resume. Only add them if they are part of your real experience.',
    });
  }

  // Experience bullet changes
  const expSections = extractExperienceSections(resumeText);
  if (expSections.length > 0) {
    const top = expSections[0];
    const bulletChanges = [];
    const usedKeywords = new Set();
    top.bullets.slice(0, 3).forEach((bullet, i) => {
      const kw = weakMatches.find((k) => !usedKeywords.has(k));
      if (!kw) return;
      usedKeywords.add(kw);
      const enhanced = `${bullet.replace(/\.$/, '')}, leveraging ${capitalize(kw)} for improved efficiency and quality.`;
      bulletChanges.push({ label: `Current bullet ${i + 1}`, content: bullet, type: 'old' });
      bulletChanges.push({ label: 'Replace with', content: enhanced, type: 'new' });
    });
    if (bulletChanges.length > 0) {
      changes.push({
        section: 'Work Experience',
        company: top.company || 'Most Recent Role',
        action: 'Modify',
        details: bulletChanges,
        reason: 'Reword existing bullets to incorporate JD language for ATS alignment without changing factual content.',
      });
    }
  }

  // Keyword enhancement
  const keywordSugs = weakMatches
    .filter((w) => !Object.values(SKILL_CATEGORIES).some((cat) => cat.includes(w.toLowerCase())))
    .slice(0, 6);
  if (keywordSugs.length > 0) {
    changes.push({
      section: 'Throughout Resume',
      action: 'Add',
      details: [{ label: 'Incorporate these JD terms naturally where applicable', content: keywordSugs.map(capitalize).join(', '), type: 'new' }],
      reason: 'These non-skill keywords from the JD should be woven into relevant sections for ATS pickup.',
    });
  }

  // Header alignment
  changes.push({
    section: 'Resume Header / Title',
    action: 'Modify',
    details: [{ label: 'Consider updating your resume title/tagline to', content: `Aspiring ${roleInfo.role} Professional | ${matchedSkills.slice(0, 3).map(capitalize).join(' · ')} | 2028 Graduate`, type: 'new' }],
    reason: 'Aligning your header with the exact role title improves ATS matching and recruiter first-impression.',
  });

  return changes;
}

function extractExperienceSections(text) {
  const sections = [];
  const lines = text.split('\n');
  let currentCompany = '';
  let bullets = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (/^[A-Z][A-Z\s&,.\-]+$/.test(trimmed) && trimmed.length > 3 && trimmed.length < 60) {
      if (currentCompany && bullets.length > 0) {
        sections.push({ company: currentCompany, bullets: [...bullets] });
      }
      currentCompany = trimmed;
      bullets = [];
    } else if (/^[•\-\*▪◦]\s/.test(trimmed) || /^\d+[\.\)]\s/.test(trimmed)) {
      bullets.push(trimmed.replace(/^[•\-\*▪◦]\s*/, '').replace(/^\d+[\.\)]\s*/, ''));
    }
  });
  if (currentCompany && bullets.length > 0) {
    sections.push({ company: currentCompany, bullets: [...bullets] });
  }
  return sections;
}

// ===== RISK GENERATION =====
function generateRisks(best) {
  const risks = [];
  const resumeLower = best.text.toLowerCase();

  const yearMatch = resumeLower.match(/(\d+)\+?\s*years?/);
  if (yearMatch) {
    risks.push(`Resume mentions "${yearMatch[0]}" of experience — verify this aligns with the JD's expectations for this role level.`);
  }

  const certs = resumeLower.match(/(?:certified|certification|certificate|aws certified|google certified|azure certified)[^.]+/gi);
  if (certs) {
    certs.slice(0, 2).forEach((cert) => {
      risks.push(`Certification mentioned: "${cert.trim()}" — ensure this is current and valid.`);
    });
  }

  if (best.weakMatches.length > best.strongMatches.length) {
    risks.push('More than half of JD keywords are missing from your resume. Consider whether you meet the minimum requirements for this role.');
  }

  risks.push('Review all suggested changes to ensure they accurately represent your real experience. Never add skills or tools you have not actually used.');
  return risks;
}
