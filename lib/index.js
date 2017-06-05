const getOrder = () => {
  fetch('/api/v1/stuff/sort', {
    method: 'GET',
  }).then((response) => {
    return response.json();
  }).then((sortedStuff) => {
    const items = sortedStuff.map(item => {
      appendSorted(item.name);
    });
  }).catch((error) => {
    error: 'cannot order items';
  });
};

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

const appendStuff = (response) => {
  $('.stuff-listing').empty();
  response.forEach((item) => {
    $('.stuff-listing').append(
      `
      <div class="indiv-stuff" id=${item.id}
        <li class='garage-item'>${item.name}</li>
        <p class='garage-item'>${item.reason}</p>
        <p class='garage-item'>${item.cleanliness}</p>
      </div>
      `,
    );
  });
  clearForm();
};


const submitNewItem = () => {
  const $name = $('.name-input').val();
  const $reason = $('.reason-input').val();
  const $cleanliness = $('.cleanliness-input').val();
  addNewStuff($name, $reason, $cleanliness);
};

const fetchStuff = () => {
  fetch('api/v1/stuff')
  .then((response) => {
    return response.json();
  })
  .then((allStuff) => {
    appendStuff(allStuff);
    $('.cleanliness-counter').empty();
    cleanlinessCounter(allStuff);
  });
};

// api calls

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

appendSorted = (name, reason, cleanliness, id) => {
  $('.stuff-listing').append(
    `
    <li>${name}</li>
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
  getOrder();
});


$('.stuff-listing').on('click', (e) => {
  $('.stuff-container').hide();
  $('.one-item').append(
    `
    <h2 class='single-item'>${e.target.innerText}</h2>
    `,
  );
});
