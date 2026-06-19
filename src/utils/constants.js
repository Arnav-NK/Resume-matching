// =============================================
// ResumeForge AI — Constants & Skill Taxonomy
// =============================================

export const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by','from','as','is','was',
  'are','were','be','been','being','have','has','had','do','does','did','will','would','shall','should',
  'may','might','can','could','must','that','this','these','those','it','its','we','our','you','your',
  'they','their','them','he','she','his','her','not','no','all','each','every','both','few','more',
  'most','other','some','such','than','too','very','just','about','above','after','again','against',
  'between','into','through','during','before','below','under','over','out','up','down','off','then',
  'once','here','there','when','where','why','how','what','which','who','whom','if','while','so',
  'also','any','work','working','including','using','used','use','ability','able','etc','e.g','i.e',
  'well','new','like','based','within','across','along','among','around','need','needs','make',
  'experience','strong','preferred','required','requirements','minimum','plus','years','year',
  'role','position','team','company','join','looking','seeking','ideal','candidate','opportunity',
  'responsibilities','qualifications','description','job','apply','application','equal','employer',
]);

export const SKILL_CATEGORIES = {
  languages: [
    'javascript','typescript','python','java','c++','c#','go','golang','rust','ruby','php','swift',
    'kotlin','scala','r','matlab','perl','lua','haskell','dart','sql','html','css','sass','less','bash',
    'shell','powershell','objective-c','assembly','vhdl','verilog','c','elixir','clojure','f#','groovy',
  ],
  frameworks: [
    'react','reactjs','react.js','angular','angularjs','vue','vuejs','vue.js','next','nextjs','next.js',
    'nuxt','svelte','express','expressjs','nestjs','django','flask','fastapi','spring','spring boot',
    'springboot','rails','ruby on rails','laravel','asp.net','.net','dotnet','gin','fiber','actix',
    'rocket','phoenix','gatsby','remix','ember','backbone','jquery','bootstrap','tailwind','tailwindcss',
    'material ui','chakra ui','ant design','three.js','electron','flutter','react native','ionic','xamarin',
  ],
  databases: [
    'mysql','postgresql','postgres','mongodb','redis','elasticsearch','cassandra','dynamodb','sqlite',
    'oracle','sql server','mariadb','neo4j','couchdb','firebase','firestore','supabase','cockroachdb',
    'influxdb','timescaledb','memcached','arangodb',
  ],
  cloud: [
    'aws','amazon web services','azure','gcp','google cloud','google cloud platform','heroku','vercel',
    'netlify','digitalocean','cloudflare','alibaba cloud','ibm cloud','oracle cloud','lambda','ec2','s3',
    'rds','ecs','eks','fargate','cloudformation','terraform','pulumi','cdk',
  ],
  devops: [
    'docker','kubernetes','k8s','jenkins','github actions','gitlab ci','circleci','travis ci',
    'ansible','puppet','chef','vagrant','helm','istio','prometheus','grafana','datadog','newrelic',
    'splunk','elk','logstash','kibana','argocd','spinnaker','tekton','ci/cd','cicd','nginx','apache',
  ],
  tools: [
    'git','github','gitlab','bitbucket','jira','confluence','slack','trello','asana','figma',
    'sketch','adobe xd','postman','insomnia','swagger','openapi','vscode','intellij','eclipse',
    'webpack','vite','babel','eslint','prettier','jest','mocha','chai','cypress','selenium',
    'playwright','pytest','junit','maven','gradle','npm','yarn','pnpm','pip','cargo','homebrew',
  ],
  concepts: [
    'rest','restful','graphql','grpc','websocket','microservices','monolith','serverless',
    'api','apis','oauth','jwt','saml','sso','ssl','tls','https','cors','cdn','dns','tcp','udp',
    'http','mvc','mvvm','oop','functional programming','design patterns','solid','dry','kiss',
    'agile','scrum','kanban','tdd','bdd','ddd','clean code','clean architecture','event driven',
    'message queue','pub sub','cqrs','event sourcing','data structures','algorithms','system design',
    'distributed systems','concurrent','multithreading','parallel','async','asynchronous','caching',
    'load balancing','rate limiting','pagination','crud','etl','data pipeline','machine learning',
    'deep learning','ai','artificial intelligence','nlp','natural language processing','computer vision',
    'neural network','tensorflow','pytorch','scikit-learn','pandas','numpy','opencv',
  ],
  soft: [
    'leadership','communication','collaboration','problem solving','problem-solving','analytical',
    'critical thinking','teamwork','mentoring','mentorship','time management','project management',
    'stakeholder','presentation','documentation','planning','strategy','innovation','creative',
    'detail oriented','detail-oriented','self-motivated','proactive','adaptable','ownership',
  ],
};

export const TARGET_ROLES = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'sde-intern', label: 'SDE Intern' },
  { value: 'swe-intern', label: 'SWE Intern' },
  { value: 'backend-intern', label: 'Backend Intern' },
  { value: 'frontend-intern', label: 'Frontend Intern' },
  { value: 'cloud-intern', label: 'Cloud Intern' },
  { value: 'fullstack-intern', label: 'Full Stack Intern' },
  { value: 'other', label: 'Other' },
];
