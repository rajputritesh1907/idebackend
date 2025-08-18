const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: String,
  createdBy: String,
  language: {
    type: String,
    default: "web" // "web", "python", "java", "cpp", "c", "nodejs", "typescript"
  },
  date: {
    type: Date,
    default: Date.now
  },
  // Web development files
  htmlCode: {
    type: String,
    default: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
    
    </body>
    </html>`
  },
  cssCode: {
    type: String,
    default: `
    body{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }`
  },
  jsCode: {
    type: String,
    default: 'console.log("Hello World")'
  },
  // Single file languages
  code: {
    type: String,
    default: ""
  },
  // For storing execution output
  output: {
    type: String,
    default: ""
  },
  // For storing input (if needed for the program)
  input: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);