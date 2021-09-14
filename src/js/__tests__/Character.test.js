import Character from '../Character';
import Bowman from '../Characters/generic/Bowman';

test('new Character Exception', () => expect(() => new Character()).toThrow('class Character can\'t be instantiated'));
test('new child of Character', () => expect(new Bowman() instanceof Character).toBe(true));
