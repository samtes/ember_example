App = Ember.Application.create();

App.Router.map(function(){
  this.resource('about');
  this.resource('posts', function() {
      this.resource('post', { path: ':post_id' });
  });
  this.resource('events', function() {
      this.resource('event', { path: ':event_id' });
  });
});

App.EventsRoute = Ember.Route.extend({
  model: function() {
    return events;
  }
});

App.EventRoute = Ember.Route.extend({
  model: function(params) {
    return events.findBy('id', params.event_id);
  }
});

App.PostsRoute = Ember.Route.extend({
  model: function() {
    return $.getJSON('http://tomdale.net/api/get_recent_posts/?callback=?').then(function(data){
      return data.posts.map(function(post) {
        post.body = post.content;
        return post;
      });
    });
  }
});

App.PostRoute = Ember.Route.extend({
  model: function(params) {
    return $.getJSON('http://tomdale.net/api/get_post/?id='+ params.post_id +'&callback=?').then(function(data){
      data.post.body = data.post.content;
      return data.post;
    });
  }
});

App.PostController = Ember.ObjectController.extend({
  isEditing: false,

  actions: {
    edit: function() {
      this.set('isEditing', true);
    },

    doneEditing: function() {
      this.set('isEditing', false);
    }
  }
});

App.EventController = Ember.ObjectController.extend({
  isEditing: false,

  actions: {
    edit: function() {
      this.set('isEditing', true);
    },

    doneEditing: function() {
      this.set('isEditing', false);
    }
  }
});

Ember.Handlebars.helper('format-date', function(date) {
  return moment(date).fromNow();
});

var showdown = new Showdown.converter();

Ember.Handlebars.helper('format-markdown', function(input) {
  return new Handlebars.SafeString(showdown.makeHtml(input));
});


var events = [{
  id: '1',
  title: 'Christmas',
  date: new Date('12-27-2012'),
  note: "This is a day where families come together and celebrate."
}, {
  id: '2',
  title: 'Easter',
  date: new Date('12-24-2012'),
  note: 'This is a day where Juesus was crusified.'
}, {
  id: '3',
  title: 'Independence Day',
  date: new Date('7-24-2013'),
  note: 'This is a day the country became free.'
}];
