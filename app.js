/*jslint maxerr:1000 */

var my = {
	qMod : require('Ti.Queue'),
	jobInfo:{total:0,completed:0}
};

(function () {
    
    var win = Ti.UI.createWindow({
        backgroundColor: '#fff', title: 'Download Queue', 
        barColor:'#000',layout:'vertical',fullscreen:false
    });
      
	win.add(Ti.UI.createLabel({
		top:0, height:25, left:5, right:5,color:'#000',
		textAlign:'left',text:'Download Queue Sample', 
		font:{fontSize:16, fontWeight:'bold'}
	}));

	win.add(Ti.UI.createLabel({
		top:10, height:25, left:5, right:5,color:'#000',
		textAlign:'left',text:'This sample downloads several, 5MB files using a queue.', 
		font:{fontSize:12}
	}));

	var progress = Ti.UI.createProgressBar({
		top:30, height:50,min:0,max:3, value:0, left:10, right:10,
		message:'Tap button to start download'
	});
	win.add(progress);
	progress.show();
	
	var downloadButton = Ti.UI.createButton({
		title:'Run Download Queue', top:40,
		left:10, right:10, height:50, 
	});
	win.add(downloadButton);
	
	//Create a new version of the queue
	var queue = new my.qMod("demo");

	//Add first job to the queue
	var sample1Name = new Date().getTime();
	queue.enqueue({
		title:'Sample ' + sample1Name,
		url:"https://github.com/benbahrenburg/Ti.Queue/blob/master/5MB.zip",
		downloadPath:Ti.Filesystem.applicationDataDirectory + sample1Name + '.zip',
		attempts:0
	});
	
	//Add second job to the queue
	var sample2Name = new Date().getTime();
	queue.enqueue({
		title:'Sample ' + sample2Name,
		url:"https://github.com/benbahrenburg/Ti.Queue/blob/master/5MB.zip",
		downloadPath:Ti.Filesystem.applicationDataDirectory + sample2Name + '.zip',
		attempts:0		
	});
	
	//Add third job to the queue
	var sample3Name = new Date().getTime();
	queue.enqueue({
		title:'Sample ' + sample3Name,
		url:"https://github.com/benbahrenburg/Ti.Queue/blob/master/5MB.zip",
		downloadPath:Ti.Filesystem.applicationDataDirectory + sample3Name + '.zip',
		attempts:0		
	});
		
	var assist = {
		progressSetup : function(min,max){
			progress.min = min;
			progress.max = max;
			progress.value = 0;
			progress.message = 'Starting download';
			downloadButton.title = "Downloading... please wait";
		},
		updateProgress : function(value,text){
			progress.value = value;
			progress.message = text;
		},
		whenFinish : function(){
			downloadButton.text = "Tap button to start download";
			alert('Finished Download');
			downloadButton.enabled = true;
		},
		next : function(){
						
			if(queue.getLength() == 0){
			   assist.updateProgress(my.jobInfo.total,'Download Completed');
			   assist.whenFinish();
			   return;
			}
			
			var amtLeft = (my.jobInfo.total - queue.getLength());
						
			var pkItem = queue.peek();
			Ti.API.info('Peek value: ' + JSON.stringify(pkItem));
					
			var item = queue.dequeue();
			assist.updateProgress(amtLeft,'Downloading ' + item.title);		
			assist.download(item,assist.next);
			
		},
		download :function(item,callback){
			var done = false;
			var xhr = Ti.Network.createHTTPClient();
			xhr.setTimeout(10000);
			xhr.onload = function(e){
				if (this.readyState == 4 && !done) {
					done=true;
					//Make sure the network didn't freak out
					if(this.status!==200){
						throw('Invalid http reply status code:' + this.status);
						return;					
					}
					var saveToFile = Titanium.Filesystem.getFile(item.downloadPath);
					if(saveToFile.exists()){
						saveToFile.deleteFile();
					}
					saveToFile.write(this.responseData);
					saveToFile = null;
					
					//Move to the next item in the queue
					callback();
				}				
			};
			xhr.onerror = function(e){
				assist.requeue(item,callback)
			};
		
			xhr.open('GET', item.url);
			xhr.send();			
		},
		requeue :function(item,callback){
			Ti.API.info('requeue is called on download fail. Allows us to retry 3 times');
			if(item.attempts > 3){
				Ti.API.info('Max attempts have been tried, item will be permanently removed from queue.')
			}else{
				item.attempts++; //Increase the attemps count
				//Add the item back into the queue
				queue.enqueue(item);
			}			
			
			callback();
		}
	};
		
	downloadButton.addEventListener('click',function(e){
		
		if(!Ti.Network.online){
			alert('This recipe requires a network connection to run, please connect and try again');
			return;
		}
		
		downloadButton.enabled = false;
		my.jobInfo.total = queue.getLength();
		my.jobInfo.completed = 0;
			
		assist.progressSetup(my.jobInfo.completed,my.jobInfo.total);
		assist.next();
		 		
	})

    win.addEventListener('close',function(e){
    	queue.empty();
    });

    win.open({modal:true});
    
})();    

