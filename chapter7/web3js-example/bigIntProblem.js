const inputObject = {
    key: 'code',
    value: 123n
};

const customJson = JSON.stringify(inputObject, (key, value) => {
    return typeof value === 'bigint' ? value.toString() : value;
});

const outputObject = JSON.parse(customJson);

console.log(`JSON: ${customJson}`);
console.log(`TYPE: ${typeof outputObject.key}  VALUE: ${outputObject.key}`);
console.log(`TYPE: ${typeof outputObject.value}  VALUE: ${outputObject.value}`); 
