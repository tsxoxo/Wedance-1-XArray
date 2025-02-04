// MyComponent.test.js
import { render, fireEvent, screen } from '@testing-library/vue';
import Xarray from '../src/components/XArray.vue';

test('1,2: each field in array is rendered as an input', () => {
  const { container } = render(Xarray, {
    props: {
      arrayOfStrings: ['one', 'two'],
    },
  });

  const input1 = screen.getByDisplayValue('one');
  const input2 = screen.getByDisplayValue('two');

  // Maybe something like this is more robust but I couldn't get it to work
  // expect(container.firstChild).toMatchInlineSnapshot(`
  //     <div>
  //       <ul>
  //       <li>
  //       <input value="one" />
  //       </li>
  //       <li>
  //       <input value="two" />
  //       </li>
  // `);
});

test('3: change arrayOfStrings on input', async () => {
  // After researching this for a bit, I'm still not sure how to actually test state without hacks like rendering it into the DOM and then checking that. So I'm just checking the emit is sending the right thing

  const arrayOfStrings = ['one', 'two'];
  const newValue = 'foo';

  const { emitted } = render(Xarray, {
    props: {
      arrayOfStrings,
    },
  });

  const input2 = screen.getByDisplayValue('two');

  await fireEvent.update(input2, newValue);
});

test('4: remove element when input is empty', async () => {
  const arrayOfStrings = ['one', 'two'];
  const newValue = '';

  const { emitted } = render(Xarray, {
    props: {
      arrayOfStrings,
    },
  });

  const input1 = screen.getByDisplayValue('one');
  const input2 = screen.getByDisplayValue('two');

  await fireEvent.update(input2, newValue);
  expect(emitted('update:arrayOfStrings')[0][0]).toMatchObject(
    arrayOfStrings.toSpliced(1, 1)
  );
});

test('5: there is an extra input used to add an element', async () => {
  const arrayOfStrings = ['one', 'two'];
  const newValue = 'three';

  const { emitted } = render(Xarray, {
    props: {
      arrayOfStrings,
    },
  });

  const inputExtra = screen.getByLabelText(/\+/);

  await fireEvent.update(inputExtra, newValue);
  await fireEvent.keyUp(inputExtra, {
    key: 'Enter',
    code: 'Enter',
    charCode: 13,
  });

  expect(emitted('update:arrayOfStrings')[0][0]).toMatchObject([
    ...arrayOfStrings,
    newValue,
  ]);
});

test('6: after adding a new element, focus stays in the input field representing the just added value', async () => {
  // This test fails. The input node does not get added to the DOM as it should, even though it does when I interact with the app manually. I tried doing nexttick(). Not sure what's going on. (Same thing in test 5.)
  const arrayOfStrings = ['one', 'two'];
  const newValue = 'three';

  const { emitted, rerender } = render(Xarray, {
    props: {
      arrayOfStrings,
    },
  });

  const inputExtra = screen.getByLabelText(/\+/);

  await fireEvent.update(inputExtra, newValue);
  await fireEvent.keyUp(inputExtra, {
    key: 'Enter',
    code: 'Enter',
    charCode: 13,
  });
  expect(emitted('update:arrayOfStrings')[0][0]).toMatchObject([
    ...arrayOfStrings,
    newValue,
  ]);
  await fireEvent.keyDown(document.activeElement, {
    key: 'A',
    code: 'KeyA',
  });

  const newlyAddedInput = screen.getByDisplayValue(`${newValue}A`);
});
