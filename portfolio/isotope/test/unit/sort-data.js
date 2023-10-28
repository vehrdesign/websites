/* globals jQuery */

QUnit.test( 'sort data', function( assert ) {

  'use strict';

  var iso = new Isotope( '#get-sort-data', {
    layoutMode: 'fitRows',
    getSortData: {
      ninjaTurtle: '[data-ninja-turtle]',
      fruit: 'span.fruit',
      b: 'b parseFloat',
      i: 'i parseInt',
      bbroke: 'b foobar',
    },
  } );

  var item0 = iso.items[0];
  var item1 = iso.items[1];

  assert.equal( item0.sortData.ninjaTurtle, 'leonardo', '[data-attr] shorthand' );
  assert.equal( item0.sortData.fruit, 'watermelon', 'query selector shorthand' );
  assert.equal( item0.sortData.b, 3.14, 'parseFloat parser' );
  assert.equal( item0.sortData.i, 42, 'parseInt parser' );
  assert.equal( item0.sortData.bbroke, '3.14', 'default nonparser' );

  // -----  ----- //

  var docElem = document.documentElement;
  var textSetter = docElem.textContent !== undefined ? 'textContent' : 'innerText';

  function setText( elem, value ) {
    elem[ textSetter ] = value;
  }

  var elem0 = iso.items[0].element;
  var elem1 = iso.items[1].element;

  elem0.setAttribute( 'data-ninja-turtle', 'donatello' );
  setText( elem0.querySelector('span.fruit'), 'mango' );
  setText( elem0.querySelector('b'), '7.24' );
  setText( elem0.querySelector('i'), 'foo' );

  iso.updateSortData( elem0 );

  var message = ', after updateSortData on single item';
  assert.equal( item0.sortData.ninjaTurtle, 'donatello',
      '[data-attr] shorthand' + message );
  assert.equal( item0.sortData.fruit, 'mango',
      'query selector shorthand' + message );
  assert.equal( item0.sortData.b, 7.24, 'parseFloat parser' + message );
  assert.ok( isNaN( item0.sortData.i ), 'parseInt parser' + message );
  assert.equal( item0.sortData.bbroke, '7.24', 'default nonparser' + message );

  // ----- update all items ----- //

  elem0.setAttribute( 'data-ninja-turtle', 'leonardo' );
  setText( elem0.querySelector('span.fruit'), 'passion fruit' );

  elem1.setAttribute( 'data-ninja-turtle', 'michelangelo' );
  setText( elem1.querySelector('span.fruit'), 'starfruit' );

  // update all
  iso.updateSortData();

  message = ', after updateSortData on all items';
  assert.equal( item0.sortData.ninjaTurtle, 'leonardo',
      '[data-attr] shorthand' + message );
  assert.equal( item0.sortData.fruit, 'passion fruit',
      'query selector shorthand' + message );
  assert.equal( item1.sortData.ninjaTurtle, 'michelangelo',
      '[data-attr] shorthand' + message );
  assert.equal( item1.sortData.fruit, 'starfruit',
      'query selector shorthand' + message );

  // ----- no items ----- //

  iso.options.itemSelector = 'none';
  iso.reloadItems();

  iso.updateSortData();
  assert.ok( true, 'updateSortData on empty container is ok' );

  iso.updateSortData( document.createElement('div') );
  assert.ok( true, 'updateSortData with non-item is ok, with no child items' );

  iso.updateSortData( false );
  assert.ok( true, 'updateSortData with falsy is ok, with no child items' );

  iso.updateSortData([]);
  assert.ok( true, 'updateSortData with empty array is ok, with no child items' );

  iso.updateSortData( jQuery() );
  assert.ok( true, 'updateSortData with empty jQuery object is ok, with no child items' );

  // ----- bad getSortData ----- //

  delete iso.options.itemSelector;
  iso.options.getSortData.badQuery = 'bad-query';
  iso.options.getSortData.badAttr = '[bad-attr]';
  iso._getSorters();
  iso.reloadItems();

  item0 = iso.items[0];

  assert.equal( item0.sortData.badQuery, null, 'bad query returns null' );
  assert.equal( item0.sortData.badAttr, null, 'bad attr returns null' );

} );
