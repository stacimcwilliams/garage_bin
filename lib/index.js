// click events

$(document).ready(() => {
  closeGarageBin()
});

$('.open-garage-btn').on('click', () => {
  openGarageBin();
});

$('.close-garage-btn').on('click', () => {
  console.log('here at closing');
  closeGarageBin()
  $('#close-garage-bin').show();
})

$('.add-stuff-btn').on('click', () => {
  submitNewItem();
});


$('.sort-items-btn').on('click', () => {
  fetch('/api/v1/stuff/sort')
  .then(response => {
    appendStuff(response)
    cleanlinessCounter(response)
  });
})

// trying to do a get by id here
// $('.stuff-listing').on('click', (e) => {
//     let id = e.target.id
//     console.log(id);
//     fetch('./api/v1/stuff/${id}')
//       .then((response) => {
//         console.log(response);
//       })
// });

$('.stuff-listing').on('click', (e) => {
  console.log(e.target.innerText);
  $('.stuff-container').hide()
  $('.one-item').append(
    `
    <h2 class='single-item'>${e.target.innerText}</h2>
    `
  )
})

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
  })
};

const fetchStuff = () => {
  fetch('api/v1/stuff')
  .then((response) => {
    return response.json();
  })
  .then((allStuff) => {
    appendStuff(allStuff);
    cleanlinessCounter(allStuff);
  });
};

// helper functions

const closeGarageBin = () => {
  $('#open-garage-bin').hide();
}

const openGarageBin = () => {
  $('#open-garage-bin').show();
  $('#close-garage-bin').hide();
  fetchStuff();
}

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
      `
    )
  })
  clearForm();
}

const cleanlinessCounter = (response) => {
  let sparkling = 0;
  let dusty = 0;
  let rancid = 0;

  response.forEach(thing => {
    if(thing.cleanliness === 'sparkling') {
      return sparkling++
    } else if (thing.cleanliness === 'dusty') {
      return dusty++
    } else if (thing.cleanliness === 'rancid') {
      return rancid++
    }
  })
  $('.cleanliness-counter').append(
    `
    <div class="counters">
      <p>Item Total:${response.length}</p>
      <p>Sparkling:${sparkling}</p>
      <p>Dusty:${dusty}</p>
      <p>Rancid:${rancid}</p>
    </div>
    `
  )
}

const clearForm = () => {
  const $name = $('.name-input').val('');
  const $reason = $('.reason-input').val('');
};

const submitNewItem = () => {
  const $name = $('.name-input').val();
  const $reason = $('.reason-input').val();
  const $cleanliness= $('.cleanliness-input').val();
  addNewStuff($name, $reason, $cleanliness);
};
