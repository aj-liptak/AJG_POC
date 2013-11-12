Parse.Cloud.define("getClient", function(request, response) {
  var query = new Parse.Query("Client");

  if(request.params.code && request.params.code.length > 0){
    query.contains('code', request.params.code);
  } else if (request.params.policy && request.params.policy.length > 0){
    query.contains('policy', request.params.policy);
  } else if (request.params.name && request.params.name > 0){
    query.contains('name', request.params.name);
  } else {
    response.error('no parameters');
  }

  query.find({
    success: function(clients) {
      // userPosts contains all of the posts by the current user.
      response.success(clients);
    },

    error: function(){
      response.error('clients lookup failed');
    }
  });
});
