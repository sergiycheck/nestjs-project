import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test('renders learn react link', () => {
  const { getByTestId } = render(
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>,
  );

  expect(getByTestId(/app-root/i)).toBeInTheDocument();
});
