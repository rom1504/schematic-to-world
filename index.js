'use strict';

var World=require("prismarine-world");
var Chunk=require("prismarine-chunk")("1.8");

var promisify = require('node-promise-es6').promisify;
var Schematic = require('mc-schematic')('1.8');

var schematicParseAsync=promisify(Schematic.parse);

Chunk.prototype.initialize=function(iniFunc,length,width,height,iniPosX,iniPosY,iniPosZ) {
  let n=iniPosX+16*(iniPosZ+16*iniPosY);
  for(let y=0;y<height;y++) {
    for(let z=0;z<length;z++) {
      for(let x=0;x<width;x++,n++) {
        const block=iniFunc(x,y,z);
        this.data.writeUInt16LE(block.type<<4 | block.metadata,n*2)
      }
    }
  }
};

World.prototype.initialize=function(iniFunc,length,width,height,iniPos) {
  const ps=[];
  for(let chunkZ=0;chunkZ<Math.ceil(length/16);chunkZ++) {
    for(let chunkX=0;chunkX<Math.ceil(width/16);chunkX++) {
      const actualChunkX=chunkX+Math.floor(iniPos.x/16);
      const actualChunkZ=chunkZ+Math.floor(iniPos.z/16);
      ps.push(this.getColumn(actualChunkX,actualChunkZ)
      .then(chunk => {
        const offsetX=chunkX*16;
        const offsetZ=chunkZ*16;
        chunk.initialize((x,y,z) => iniFunc(x+offsetX,y,z+offsetZ),Math.min(16,length-offsetZ),Math.min(16,width-offsetX),height,iniPos.x%16,iniPos.y,iniPos.z%16);
        return this.setColumn(actualChunkX,actualChunkZ,chunk);
      }));
    }
  }
  return Promise.all(ps);
};

function addSchematicToWorld(data,world,iniPos) {
  return schematicParseAsync(data)
    .then(schem => {
      return world.initialize((x, y, z) => {
        var block = schem.getBlock(x, y, z);
        block.type=block.type & 0xff;
        return block;
      }, schem.length, schem.width, schem.height,iniPos)
    });
}

module.exports=addSchematicToWorld;
