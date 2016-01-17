'use strict';

var promisify = require('node-promise-es6').promisify;
var Schematic = require('mc-schematic')('1.8');

var schematicParseAsync=promisify(Schematic.parse);

function addSchematicToWorld(data,world,iniPos) {
  return schematicParseAsync(data)
    .then(schem => {
      return world.initialize((x, y, z) => {
        var block = schem.getBlock(x, y, z);
        block.skyLight=15;
        return block;
      }, schem.length, schem.width, schem.height,iniPos)
    });
}

module.exports=addSchematicToWorld;
