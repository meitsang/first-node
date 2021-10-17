const carlistNode = document.getElementById('cars-list');
const pizzalistNode = document.getElementById('pizza-list');

(async() => {
  try {
    const response = await fetch('/api/v1/cars');
    if(!response.ok) throw response;
    const data = await response.json();
    const frag = document.createDocumentFragment();
    for(const car of data) {
      const li = document.createElement('li');
      li.textContent = `name:${car.name} ; bhp:${car.bhp}`;
      frag.append(li);
    }
    carlistNode.innerHTML="";
    carlistNode.append(frag);
  } catch (err) {
    console.log(err)
  }
  
  try {
    const response = await fetch('/api/v1/pizzas');
    if(!response.ok) throw response;
    const data = await response.json();
    const frag = document.createDocumentFragment();
    for(const pizza of data) {
      const li = document.createElement('li');
      li.textContent = `name: ${pizza.name}; size: ${pizza.size}" ; toppings: ${pizza.toppings}`;
      frag.append(li);
    }
    pizzalistNode.innerHTML="";
    pizzalistNode.append(frag);
  } catch (err) {
    console.log(err)
  }

})();