import onChange from 'on-change';

const handleErrors = (elements, state) => {
  const { input, feedback } = elements;
  const { error } = state.form;
  input.classList.toggle('is-invalid', error);
  feedback.textContent = error || '';
};

const handleForm = (elements, state) => {
  const { status } = state.form;
  const { form, input, button } = elements;

  const mapping = {
    filling: () => {
      input.disabled = false;
      button.disabled = false;
      input.focus();
    },
    sending: () => {
      input.disabled = true;
      button.disabled = true;
    },
    success: () => {
      form.reset();
    },
  };

  return mapping[status]();
};

export default (elements, state) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.status':
      case 'form':
        handleForm(elements, state);
        handleErrors(elements, state);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
