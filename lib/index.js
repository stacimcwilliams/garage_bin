console.log('hello');
$( document ).ready(function() {
  console.log( "ready!" );
});

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

// Functions

const countStuff = (allStuff) => {
  console.log(allStuff.length);
  $('.count-container').append(
    `<p>${allStuff.length}</p>`
  )
}

const closeGarageBin = () => {
  $('#open-garage-bin').hide();
}

const openGarageBin = () => {
  $('#open-garage-bin').show();
  $('#close-garage-bin').hide();
  fetchStuff()
}

const appendStuff = (allStuff) => {
  allStuff.forEach((item) => {
    $('.stuff-listing').append(
      `
      <li class='garage-item'>${item.name}</li>
      `
    )
  })
}

const submitNewItem = () => {
  const name = $('.name-input').val();
  const reason = $('.reason-input').val();
  const cleanliness= $('.cleanliness-input').val();
  addNewStuff(name, reason, cleanliness);
};

// api calls

const addNewStuff = (name, reason, cleanliness) => {
  fetch('/api/v1/stuff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, reason, cleanliness }),
  })
  .then((response) => {
    return response.json();
  })
  .then((newStuff) => {
    appendStuff(newStuff);
  });
};

const fetchStuff = () => {
  fetch('api/v1/stuff')
  .then((response) => {
    return response.json();
  })
  .then((allStuff) => {
    appendStuff(allStuff)
    countStuff(allStuff)
  });
};
