'use strict';

var World=require("prismarine-world");
var Vec3=require("vec3").Vec3;
var addSchematicToWorld=require("./");
var fs = require('node-promise-es6').fs;
var Chunk=require("prismarine-chunk")("1.8");

if(process.argv.length !=3) {
  console.log("Usage : node example.js <schematic>");
  process.exit(1);
}

var world=new World(()=>new Chunk());

return fs.readFile(process.argv[2])
  .then(data => addSchematicToWorld(data,world,new Vec3(50,0,0)))
  .then(() => world.getBlockType(new Vec3(4*16+50,0,5*16)))
  .then((type) => console.log(type))
  .catch(err => console.log(err.stack));
