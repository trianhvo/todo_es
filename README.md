
```
todo_es
├─ .env
├─ Archieve
├─ README.md
├─ package.json
├─ src
│  ├─ app
│  │  ├─ controllers
│  │  │  ├─ MappingController.js
│  │  │  ├─ TaskController.js
│  │  │  ├─ TemplateController.js
│  │  │  └─ UserController.js
│  │  ├─ middlewares
│  │  │  ├─ authValidation.js
│  │  │  ├─ taskOwnershipValidation.js
│  │  │  ├─ taskValidation.js
│  │  │  └─ userValidation.js
│  │  └─ validation
│  │     ├─ schema
│  │     │  ├─ createTaskSchema.json
│  │     │  ├─ createUserSchema.json
│  │     │  ├─ updateTaskSchema.json
│  │     │  └─ updateUserSchema.json
│  │     └─ schemaReader.js
│  ├─ config
│  │  ├─ cucumber.js
│  │  ├─ swaggerConfig.js
│  │  ├─ swaggerDoc.js
│  │  └─ test-config.js
│  ├─ index.js
│  └─ routes
│     ├─ index.js
│     ├─ mappings.js
│     ├─ tasks.js
│     ├─ templates.js
│     └─ users.js
└─ test
   └─ features
      ├─ dataset
      │  └─ dataset.json
      ├─ report
      │  ├─ cucumber_report.html
      │  └─ cucumber_report.json
      ├─ step_definitions
      │  └─ stepdefs.js
      └─ tasks.feature

```