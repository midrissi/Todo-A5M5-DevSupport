const ordinal = require("ordinal");

for(let i = 0; i<100; i += 1){
  new ds.Todo({
    description: `${ordinal(i+1)} Todo...`,
    done: false
  }).save();
}
