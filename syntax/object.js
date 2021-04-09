var members = ['ego','k88','ho'];
console.log(members[1]);
var i=0;
while(i<members.length){
    console.log('array loop',members[i]);
    i+=1;
}

var roles={
    'programmer':'ego',
    'designer' : 'k88',
    'manager' : 'ho'
}
console.log(roles['designer']);

for (var name in roles){
    console.log('object => ', name, 'value => ', roles[name]);
}