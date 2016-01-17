'use strict';

var World=require("prismarine-world");
var Vec3=require("vec3").Vec3;
var addSchematicToWorld=require("../");
var fs = require('node-promise-es6').fs;
var Chunk=require("prismarine-chunk")("1.8");
var promisify = require('node-promise-es6').promisify;
var Schematic = require('mc-schematic')('1.8');
var assert=require('assert');

var schematicParseAsync=promisify(Schematic.parse);

describe("add the schematic properly",function(){
  this.timeout(10000);

  var world=new World(()=>new Chunk());
  var schem;
  it("read the schematic",()=> {
    return fs.readFile(__dirname+"/fantasy-fort.schematic")
      .then(data => schematicParseAsync(data))
      .then(sch => schem=sch)
  });

  var iniPoss=[new Vec3(1000,65,78),new Vec3(320,65,577),new Vec3(-320,65,-577)];

  iniPoss.forEach(iniPos => {
    describe("works with iniPos="+iniPos, () => {
      it("load the schematic",()=>  {
        return fs.readFile(__dirname+"/fantasy-fort.schematic")
          .then(data => addSchematicToWorld(data,world,iniPos))
      });

      it("has loaded the schematic properly",() => {
        var ps=[];
        for(let y=0;y<Math.min(10,schem.height);y++) {
          // TODO: the full schema will be checked once prismarine-world has an good function to loop all the blocks in a cube
          for(let z=0;z<Math.min(1000,schem.length);z++) {
            for(let x=0;x<Math.min(10,schem.width);x++) {
              ps.push(world.getBlockType(iniPos.offset(x,y,z))
                .then(type=>{
                  assert.equal(type,schem.getBlock(x,y,z).type&0xff,"wrong type at "+x+","+y+","+z);
                }))
            }
          }
        }
        return Promise.all(ps);
      })
    });
  })

});