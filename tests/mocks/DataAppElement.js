// Vueitfy need a element with a data-app attribute
export default function addElemWithDataAppToBody() {
  const app = document.createElement('div');
  app.setAttribute('data-app', true);
  document.body.append(app);
};