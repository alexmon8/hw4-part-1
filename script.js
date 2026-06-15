/*
  COMP 4610 GUI I - HW4 Part 1: Dynamic Multiplication Table
  Author: Alexi Montesinos
  Email: Alexi_Montesinos@student.uml.edu
  Description: Initializes the jQuery Validation plugin on the table-range form.
               Custom rules enforce integer-only input, the -50/50 range limit,
               and the min ≤ max constraint. On success the table is built in the
               DOM without any page reload.
*/

$(function () {
  const LIMIT = 50;

  // ── Custom validation rules ───────────────────────────────

  /* Rejects decimals like 3.5 — the built in 'number' rule allows them */
  $.validator.addMethod('integer', function (value, element) {
    return this.optional(element) || /^-?\d+$/.test(value.trim());
  }, 'Please enter a whole number with no decimal point.');

  /* Ensures maxCol >= minCol; attached only to maxCol so the error appears once */
  $.validator.addMethod('colOrderMax', function (value) {
    const min = parseInt($('#minCol').val(), 10);
    const max = parseInt(value, 10);
    return isNaN(min) || isNaN(max) || max >= min;
  }, 'Maximum Column Value must be ≥ Minimum Column Value.');

  /* Ensures maxRow >= minRow; attached only to maxRow */
  $.validator.addMethod('rowOrderMax', function (value) {
    const min = parseInt($('#minRow').val(), 10);
    const max = parseInt(value, 10);
    return isNaN(min) || isNaN(max) || max >= min;
  }, 'Maximum Row Value must be ≥ Minimum Row Value.');

  // ── Validator setup ───────────────────────────────────────

  $('#tableForm').validate({
    rules: {
      minCol: { required: true, integer: true, min: -LIMIT, max: LIMIT },
      maxCol: { required: true, integer: true, min: -LIMIT, max: LIMIT, colOrderMax: true },
      minRow: { required: true, integer: true, min: -LIMIT, max: LIMIT },
      maxRow: { required: true, integer: true, min: -LIMIT, max: LIMIT, rowOrderMax: true }
    },

    messages: {
      minCol: {
        required:  'Minimum Column Value is required — enter a whole number between -50 and 50.',
        integer:   'Minimum Column Value must be a whole number (e.g. -5, 0, 10).',
        min:       'Minimum Column Value must be at least -50.',
        max:       'Minimum Column Value must be no greater than 50.'
      },
      maxCol: {
        required:     'Maximum Column Value is required — enter a whole number between -50 and 50.',
        integer:      'Maximum Column Value must be a whole number (e.g. -5, 0, 10).',
        min:          'Maximum Column Value must be at least -50.',
        max:          'Maximum Column Value must be no greater than 50.',
        colOrderMax:  'Maximum Column Value must be ≥ Minimum Column Value — increase this value or decrease the minimum.'
      },
      minRow: {
        required:  'Minimum Row Value is required — enter a whole number between -50 and 50.',
        integer:   'Minimum Row Value must be a whole number (e.g. -5, 0, 10).',
        min:       'Minimum Row Value must be at least -50.',
        max:       'Minimum Row Value must be no greater than 50.'
      },
      maxRow: {
        required:    'Maximum Row Value is required — enter a whole number between -50 and 50.',
        integer:     'Maximum Row Value must be a whole number (e.g. -5, 0, 10).',
        min:         'Maximum Row Value must be at least -50.',
        max:         'Maximum Row Value must be no greater than 50.',
        rowOrderMax: 'Maximum Row Value must be ≥ Minimum Row Value — increase this value or decrease the minimum.'
      }
    },

    errorElement: 'span',
    errorClass: 'field-error',

    /* Place each error span directly below its input field */
    errorPlacement: function (error, element) {
      error.insertAfter(element);
    },

    highlight: function (element) {
      $(element).addClass('input-error');
    },
    unhighlight: function (element) {
      $(element).removeClass('input-error');
    },

    /* When minCol changes, recheck maxCol's ordering rule */
    onfocusout: function (element) {
      this.element(element);
      if (element.id === 'minCol' && $('#maxCol').val() !== '') {
        this.element('#maxCol');
      }
      if (element.id === 'minRow' && $('#maxRow').val() !== '') {
        this.element('#maxRow');
      }
    },

    submitHandler: function () {
      buildTable(
        parseInt($('#minCol').val(), 10),
        parseInt($('#maxCol').val(), 10),
        parseInt($('#minRow').val(), 10),
        parseInt($('#maxRow').val(), 10)
      );
      return false; // prevent actual HTTP form submission
    }
  });

  // ── Table builder ─────────────────────────────────────────

  function buildTable(minCol, maxCol, minRow, maxRow) {
    const container = document.getElementById('table-container');
    container.innerHTML = '';

    const table  = document.createElement('table');
    const thead  = document.createElement('thead');
    const hRow   = document.createElement('tr');

    const corner = document.createElement('th');
    corner.textContent = '×';
    hRow.appendChild(corner);

    for (let c = minCol; c <= maxCol; c++) {
      const th = document.createElement('th');
      th.textContent = c;
      hRow.appendChild(th);
    }

    thead.appendChild(hRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (let r = minRow; r <= maxRow; r++) {
      const tr = document.createElement('tr');
      const rh = document.createElement('td');
      rh.textContent = r;
      tr.appendChild(rh);

      for (let c = minCol; c <= maxCol; c++) {
        const td = document.createElement('td');
        td.textContent = r * c;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    container.appendChild(table);
    document.getElementById('table-section').classList.remove('hidden');
  }
});
