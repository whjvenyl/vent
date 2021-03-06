require('../lib/vent.js');

describe('Vent: on', () => {
    let markup, rootElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        rootElement.innerHTML = `
            <div class="some-class">
                <ul id="some-list">
                    <li>item:1</li>
                    <li>item:2</li>
                </ul>
                <a href="#!">click me!</a>
            </div>
        `;
        document.body.appendChild(rootElement);
    });

    afterEach(() => {
        rootElement.remove();
    });

    it('Should return current instance', () => {
        const v = vent('li');
        expect(v.on('click', jest.fn())).toBe(v);
    });

    describe('call addEventListener', () => {
        it('Should call addEventListener on every matched selector', () => {
            const nodes = vent('li');
            nodes.forEach((node) => node.addEventListener = jest.fn());
            vent('li').on('click', jest.fn());
            nodes.forEach((node) => {
                expect(node.addEventListener).toHaveBeenCalled();
                node.addEventListener.mockRestore();
            });
        });

        it('Should call passed handler each time the event is fired', () => {
            const handler = jest.fn();
            vent('li').on('click', handler).trigger('click');
            expect(handler).toHaveBeenCalledTimes(2);
        });
    });

    describe('Multiple events', () => {
        it('Should accept space delimited events', () => {
            let handler = jest.fn();
            vent('a').on('click mouseenter', handler).trigger('click mouseenter');
            expect(handler).toHaveBeenCalledTimes(2);
        });

        it('Should prevent duplication when registering events', () => {
            let handler = jest.fn();
            vent('a').on('click click', handler).trigger('click click');
            expect(handler).toHaveBeenCalledTimes(1);
        });
    });

    describe('Event delegation', () => {
        it('Should allow delegation via second argument', () => {
            const handler = jest.fn();
            vent('ul').on('click', 'li:first-child', handler);
            vent('li').add('ul').trigger('click');
            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler.mock.calls[0][0].target).toBe(document.querySelector('li:first-child'));
        });
    });
});
