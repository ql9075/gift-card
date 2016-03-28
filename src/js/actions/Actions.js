/*
 *  FLUX APP ACTIONS
 */

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Constants = require('../constants/Constants')
  ;

var AppActions = {
  /**
   * @param  {string} text
   */
  create: function(text) {
    AppDispatcher.dispatch({
      actionType:Constants.CREATE,
      text:text
    });
  },

  /**
   * @param  {string} id The ID of the APP item
   * @param  {string} text
   */
  update: function(id, text) {
    AppDispatcher.dispatch({
      actionType:Constants.UPDATE,
      id:id,
      text:text
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: Constants.DESTROY,
      id: id
    });
  },

  /**
   * @param  {string} id
   */
  destroyCompleted: function(id) {
    AppDispatcher.dispatch({
      actionType: Constants.DESTROY_COMPLETED,
    });
  },


};
