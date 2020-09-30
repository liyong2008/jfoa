"use strict";

const fs = require("fs");
const path = require("path");
const vfs = require("vinyl-fs");
const through = require("through2");
const yaml = require("js-yaml");

(function() {
   const generateIndexFile = function(directory, configFile, baseName, typeName) {
      const outFilePath = path.join(directory, baseName + "." + typeName + ".ts");
      let outFileContent = `/*
 * Copyright (c) 2020, JavaFamily Technology Corp, All Rights Reserved.
 *
 * The software and information contained herein are copyrighted and
 * proprietary to JavaFamily Technology Corp. This software is furnished
 * pursuant to a written license agreement and may be used, copied,
 * transmitted, and stored only in accordance with the terms of such
 * license and with the inclusion of the above copyright notice. Please
 * refer to the file "COPYRIGHT" for further copyright and licensing
 * information. This software and information or any other copies
 * thereof may not be provided or otherwise made available to any other
 * person.
 */

/*
 * This file is automatically generated. Do not edit this file directly. Modify the
 * ${baseName}.${typeName} section of ${configFile} instead
 * Run "ant angular.generate-index-files" in the build directory to update the generated
 * file.
 */

import { Type } from "@angular/core";
`;

      const importStatements = [];
      const classNames = [];

      const addSourceFile = function(file, enc, cb) {
         if(file.isStream()) {
            this.emit("error", "Typescript streams are not supported");
         }

         if(file.isBuffer()) {
            let sourcePath = path.relative(directory, file.path)
               .replace(/\\/g, "/").replace(/\.ts$/, "");

            if(!sourcePath.startsWith("..")) {
               sourcePath = "./" + sourcePath;
            }

            const expr = /^export class ([^ ]+)( .*)?$/mg;
            const content = file.contents.toString("utf8");
            let match;

            while((match = expr.exec(content)) != null) {
               const className = match[1].trim();
               classNames.push(className);
               importStatements.push(`import { ${className} } from "${sourcePath}";`);
            }
         }

         return cb();
      };

      const flushIndexFile = function(cb) {
         importStatements.sort();
         classNames.sort();

         importStatements.forEach((importStatement) => {
            outFileContent += `${importStatement}
`;
         });

         outFileContent += `
export const MODULE_${typeName.toUpperCase()}: Type<any>[] = [
`;

         classNames.forEach((className, index) => {
            outFileContent += `   ${className}`;

            if(index < classNames.length - 1) {
               outFileContent += ",";
            }

            outFileContent += `
`;
         });

         outFileContent += `];
`;

         fs.writeFileSync(outFilePath, outFileContent);
         return cb();
      };

      return through.obj({objectMode: true}, addSourceFile, flushIndexFile);
   };

   const parseConfigFile = function() {
      const processConfigFile = function(file, enc, cb) {
         if(file.isStream()) {
            return this.emit("error", "YAML streams are not supported");
         }

         if(file.isBuffer()) {
            const directory = path.dirname(file.path);
            const configFileName = path.basename(file.path);
            const config = yaml.load(file.contents.toString("utf8"), {});

            Object.keys(config).forEach((baseName) => {
               Object.keys(config[baseName]).forEach((typeName) => {
                  let typeIncludes = config[baseName][typeName].includes.map((v) => path.join(directory, v));
                  const typeExcludes = config[baseName][typeName].excludes;

                  if(typeExcludes) {
                     typeIncludes = typeIncludes.concat(typeExcludes.map((v) => "!" + path.join(directory, v)));
                  }

                  vfs.src(typeIncludes, {base: directory})
                     .pipe(generateIndexFile(directory, configFileName, baseName, typeName));
               });
            });
         }

         return cb();
      };

      return through.obj({objectMode: true}, processConfigFile);
   };

   vfs.src("./src/**/*.yaml").pipe(parseConfigFile());
})();
