<h1>Ti.Queue</h1>

Pure JavaScript Queueing for Titanium

<h2>Features</h2>
* Ability to create persistent (named) or session based queues.
* LIFO and FIFO support
* Is a single CommonJS file so easy to modify

<h2>How to install</h2>

Installing Ti.Queue is straightforward, simply copy the ti.queue.js file into your Titanium project.

Since Ti.Queue is a CommonJS module, can you import the module anywhere in your app by simply using the require method.

For example:
```javascript
var mod = require('Ti.Queue');
```

<h2>Sample</h2>

First requre the module into our project

```javascript
var mod = require('Ti.Queue');
```

Next create a named queue

```javascript
  //providing a new automatically creates a persistent queue
  //if no name is provided a session queue is created
  var queue = new mod("demo");
```

Then add a job to the queue

```javascript
queue.enqueue({title:'Sample 1', message:'hello world'});
```

You can peek at the next value in the queue

```javascript
Ti.API.info('Peek value: ' + JSON.stringify(queue.peek());
```

By calling dequeue you pop the next job from the queue.

```javascript
var job = queue.dequeue();
```

(!) If a name is provided to the queue the next time you create a queue with the same name any jobs queued will be re-loaded. Otherwise the queue will only hold the jobs for a session.

<h2>Example app.js</h2>
Please download the demo project's [app.js](https://github.com/benbahrenburg/Ti.Queue/blob/master/app.js) for a complete sample.

<h2>Licensing & Support</h2>

This project is licensed under the OSI approved Apache Public License (version 2). For details please see the license associated with each project.

Developed by [Ben Bahrenburg](http://bahrenburgs.com) available on twitter [@benCoding](http://twitter.com/benCoding)

<h2>Learn More</h2>

<h3>Twitter</h3>

Please consider following the [@benCoding Twitter](http://www.twitter.com/benCoding) for updates 
and more about Titanium.

<h3>Blog</h3>

For module updates, Titanium tutorials and more please check out my blog at [benCoding.Com](http://benCoding.com). 
