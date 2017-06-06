const cleanlinessCounter = (response) => {
  let sparkling = 0;
  let dusty = 0;
  let rancid = 0;

  response.forEach(thing => {
    if (thing.cleanliness === 'sparkling') {
      return sparkling++;
    } else if (thing.cleanliness === 'dusty') {
      return dusty++;
    } else if (thing.cleanliness === 'rancid') {
      return rancid++;
    }
  });

  $('.cleanliness-counter').append(
    `
    <div class="counters">
      <p>Item Total:${response.length}</p>
      <p>Sparkling:${sparkling}</p>
      <p>Dusty:${dusty}</p>
      <p>Rancid:${rancid}</p>
    </div>
    `,
  );
};

const clearForm = () => {
  const $name = $('.name-input').val('');
  const $reason = $('.reason-input').val('');
};

const appendStuff = (name, reason, cleanliness, id) => {
  $('.stuff-listing').append(
      `
      <div class="indiv-stuff" id=${id}>
        <li class='garage-item'>${name}</li>
        <p class='garage-item'>${reason}</p>
         <p class='garage-item'>${cleanliness}</p>
      </div>
      `,
    );
  clearForm();
};

const submitNewItem = () => {
  const $name = $('.name-input').val();
  const $reason = $('.reason-input').val();
  const $cleanliness = $('.cleanliness-input').val();
  addNewStuff($name, $reason, $cleanliness);
};

appendSorted = (name, reason, cleanliness, id) => {
  $('.stuff-listing').append(
    `
      <div class='stuff-container'>
    <li class='indiv-stuff'>${name}</li>
    </div>
    `,
  );
};

const closeGarageBin = () => {
  $('#open-garage-bin').hide();
};

const openGarageBin = () => {
  $('#open-garage-bin').show();
  $('#close-garage-bin').hide();
  fetchStuff();
};

const clearStuff = () => {
  $('.stuff-listing').empty();
};

// api calls

const getOrder = () => {
  fetch('/api/v1/stuff/sort', {
    method: 'GET',
  }).then((response) => {
    return response.json();
  }).then((sortedStuff) => {
    const items = sortedStuff.map(item => {
      appendSorted(item.name, item.reason, item.cleanliness);
    });
  }).catch((error) => {
    error: 'cannot order items';
  });
};

const addNewStuff = (name, reason, cleanliness) => {
  fetch('/api/v1/stuff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, reason, cleanliness }),
  })
  .then(() => {
    fetchStuff();
    clearForm();
  });
};

const fetchStuff = () => {
  fetch('api/v1/stuff')
  .then((response) => {
    return response.json();
  })
  .then((allStuff) => {
    const items = allStuff.map(item => {
      appendStuff(item.name, item.reason, item.cleanliness, item.id);
    });
    $('.cleanliness-counter').empty();
    cleanlinessCounter(allStuff);
  });
};

const getOneItem = (id) => {
  console.log(id);
  fetch(`/api/v1/stuff/${id}`)
    .then(response => response.json())
    .then((item) => {
      appendStuff(item[0].name, item[0].reason, item[0].cleanliness, item[0].id);
    })
    .catch((error) => {
      response.send({ error });
    });
};

// Click events

$(document).ready(() => {
  closeGarageBin();
});

$('.open-garage-btn').on('click', () => {
  openGarageBin();
});

$('.close-garage-btn').on('click', () => {
  closeGarageBin();
  $('#close-garage-bin').show();
});

$('.add-stuff-btn').on('click', () => {
  submitNewItem();
});

$('.sort-items-btn').on('click', (e) => {
  e.preventDefault();
  clearStuff();
  getOrder();
});

$('.stuff-listing').on('click', '.indiv-stuff', (e) => {
  clearStuff();
  getOneItem(e.target.id);
});
