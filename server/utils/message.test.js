var expect = require('expect');
var {generateMessage} = require('./message');

describe('generateMessage', ()=>{
  it('It should generate the correct message object', ()=>{
      var from = 'Hassan';
      var text = 'Sanga e bhai jan';
      var message = generateMessage(from, text);

      //expect(message.createdAt).toBeA('number');
      expect(message).toInclude({ from, text });
  });
});
