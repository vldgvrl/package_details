import React, {useState} from 'react';
import "./UploadFile.css";

    //Variable shows choosen package name
    var activePackage = "";
    var activePackageID = 0;

    //Package list (all package information in one row)
    var contents;
    var packageList;

    //array with all dependencies
    var allDep = [];
    
    //ArrayList for reverse dependencies
    var arrayReverse = [];

  function UploadFile(){

      const [listitems, setLink] = useState([]);

      const addLink = (i, n) => {
            setLink(listitems => listitems.concat({id: i, name: n}))
      };

      const getListItems = listitems.map((listitem) =>
                <li><a onClick={() => showDetails(listitem.id)} href="#">{listitem.name}</a></li>
            );


    const [test, setTest] = useState();

    const testrun = ({id}) => <li><a onClick={() => showDetails({id})}>PackageNameTEST</a></li>


    return(
       <div>
            <div id="header">
                <div id="input_file">
                    <p>Choose the status file,<br /> pressing this button: <input type="file" id="fileinput" onChange={readStatusFile} /></p>
                </div>
                <div id="info"></div>
            </div>
            <div id="detailsBox">
                <p id="details">This box shows details of the chosen package</p>
            </div>
            <ul id="text">
                    {getListItems}
            </ul>
       </div> 
    );


     //======Open the status file=====

  function readStatusFile(evt) {
    var infoBox = document.getElementById("info").insertAdjacentHTML("beforeend",  "The packages are loading...It may take a while (~1 min) Not leave this page. I am working on making loading of this page faster. Sorry for inconvinience"); 
    var f = evt.target.files[0];   
    var elem = document.getElementById("text");
    if (f) {
      var r = new FileReader();
      r.onload = function(e) { 
          contents = e.target.result;             
          var ct = r.result;

          packageList = contents.split('Package: '); //One package in one row (with \n)
          packageList.shift(); //Delete word package from list
          packageList.sort(); //Sort packages alphabetically

          //Onload also show the list of packages with links
          for (var i=0; i<packageList.length; i++){

              //packageLine is the list of rows per one package
              var packageLine = packageList[i].split('\n');
              addLink(i, packageLine[0]);


          }


	  var infoBox = document.getElementById("info").innerHTML = "";
	  var infoBox = document.getElementById("info").insertAdjacentHTML("beforeend",  "On the page should be shown the list of the packages. If there is no any packages next to detail box, check the opened file"); 
	  
	//Make the list with all dependencies
	findingAllDependencies();
    } 
      r.readAsText(f);
    } else { 
      alert("Failed to load file");
    }
  }
  //=====End open function=====
}
  function ShowPackageList(){
      
      const listitems = [];
      const getListItems = listitems.map((listitem) =>
                <li><a onClick={() => showDetails(listitem.id)}></a>{listitem.name}</li>
            );


      if (listitems != null){
                    return(
                        <h3>There is no file to read </h3>
                        

                    );
      }  else {

              packageList = contents.split('Package: '); //One package in one row (with \n)
              packageList.shift(); //Delete word package from list
              packageList.sort(); //Sort packages alphabetically

              //Onload also show the list of packages with links
              for (var i=0; i<packageList.length; i++){

                  //packageLine is the list of rows per one package
                  var packageLine = packageList[i].split('\n');
                  listitems.push({id: i, name: packageLine[0]});


              }

              return(
                {getListItems}
              );

      }
  }


    //=====Function makes the list of dependencies lists=====
    function findingAllDependencies(){

	    var packListR= packageList;

	    //one package per list for reverse finding
	    var onePackageList = [];


	    for (var pLR of packListR){
		onePackageList.push(pLR.split('\n'));
	    }

	    //id link for packageLink
	    var id=0;

	    for (var pN of onePackageList){

		dependRow();

		//Finding the row which include information about Dependencies
		function dependRow(){
		    for (var el of pN){
		    
			    //If the row includs a text "Depends:" 
			    if (el.substring(0, 9) === "Depends: "){

				//Devide packages in line
				var splitedDRow = el.split(',').join(':').split(':');
				splitedDRow.shift();

				//Add to list (Id link, package name, dependencies in the package)
				allDep.push([id, pN[0], splitedDRow]);
				
			    }
		    }

		}
		
		id++;
	    }
		    
	console.log("All dependencies");
	console.log(allDep);
    }

    //Finding the reverse dependencies
    function reverseDependencies(){

	    arrayReverse = [];	    

	    //allDep[x][2] - include all depends packages
	    //allDep[x][2][b] - include each depends package
	    for (var x=0; x<allDep.length; x++){
		for (var b=0; b<allDep[x][2].length; b++){

		    //Delete versions and spaces from package name in dependencies
		    var clearNameList = allDep[x][2][b].split(' ');
		    if (clearNameList[0].length == 0){
			clearNameList.shift();
		    }


		   //If the depends package was found, then add the package id (allDep[x][0]) and
		   //name (allDep[x][1]) to reverse list
		   if (clearNameList[0] === activePackage){
			arrayReverse.push([allDep[x][0], allDep[x][1] ]); 
		    }
		}
	    }

	    makeLinksFunc(arrayReverse);

	    //If there is no any dependencies return info message
	    if (arrayReverse === undefined || arrayReverse.length == 0) {
		arrayReverse.push("There is no any dependencies");
	    }

	    return arrayReverse;
    }
    
    //Add links to reverse dependencies (the list is included like parameter)
    function makeLinksFunc(list){
	    
	    arrayReverse = []; //Make the list empty after the previous package viewing 
	    var revPackName = "";

	    for (var link of list){
			
		revPackName = "<a onclick='showDetails(" + link[0] + ")' href='#'>" +
		link[1] + "</a>"; 

		//Prepare the list with all reverse dependencies with links
		arrayReverse.push(revPackName);
	    }
	    
	    //Delete duplicates 
	    arrayReverse = [...new Set(arrayReverse)];

    }


  

    //=====Function write all information about the package=====
    //paarameter 'number' is a ID of the invited package 
    function showDetails(number){


	var detailsBox = document.getElementById("detailsBox");

	//initiate the package from whole list
	var packageLine = packageList[number].split('\n');

	//Inform about the invited package to the global
	activePackage = packageLine[0];
	activePackageID = number;

	detailsBox.innerHTML = "<h2 id='details'>Package: " + packageLine[0] + "</h2>";
	var details = document.getElementById("details");

	//It is possible to show all information of the package with that peace of that code
	/*for (c=0; c<packageLine.length; c++){
		
	    details.insertAdjacentHTML("beforeend", packageLine[c] + "<br>");
	    
	}*/

	    //Define which lines include Description part and return 2 lines: first and last
	    var fromTo = information("Description: ");

	    //Write lines which include dscription text
	    for (var count=fromTo[0]; count<=fromTo[1]; count++){
		detailsBox.insertAdjacentHTML("beforeend", packageLine[count] + '<br>'); 
	    }

	    //Find 'Dependencies' information in ArrayList
	    var dependencies = findDep();

	    //Depends title
	    detailsBox.insertAdjacentHTML("beforeend", "<h3 id='depends' >Current package depends on:</h3>");
	
	    //Write lines with dependencies 
	    for (var d of dependencies){
		detailsBox.insertAdjacentHTML("beforeend", d + '<br>'); 
	    }

	    //Invite the function to find 'Reverse dependencies' information and receive it in ArrayList
	    var reverseD = reverseDependencies(); 

	    //Reverse dependencies title
	    detailsBox.insertAdjacentHTML("beforeend", "<h3 id='reverseDep' >Packages that depend on the current package:</h3>");

	    //Write lines with reverse dependencies
	    for (var r of reverseD){
		detailsBox.insertAdjacentHTML("beforeend", r + '<br>'); 
	    }

	//Function for finding description information
	//Function return list of two numbers that indicades index of the rows
	function information(string){

	    var firstLine, lastLine;

	    //Find the first searching word in the line
	    for (var l=0; l<packageLine.length; l++){
		if (packageLine[l].substring(0, 13) === string){
		   firstLine =  l;
		}

		//if the line starts from ' ' then it belongs to description part
		if(firstLine < l){
		    if (packageLine[l].substring(0, 1) === ' '){
			lastLine = l;
		    }
	    
		}
	    }
	    return [firstLine, lastLine];
	}

	//Function for finding Dependencies 

	function findDep(){
	    
	    // return arrayList, prepared dependencies with links
	    var dependsArray = []; 

	    //ArrayList of needed dependencies without links
	    var arrayListDep = []; 

		for (var l=0; l<packageLine.length; l++){

		    //Find the row which starts from the 'Depends'
		    if (packageLine[l].substring(0, 9) === "Depends: "){

			//Remove package versions in brackets, spaces, commas
			arrayListDep = packageLine[l].split(/ *\([^)]*\) */).join(" ").split(" ").join(",").split(",");
			arrayListDep.shift(); //Remove 'Depends: ' text from list


			makeLinks();

		    }
		    
		}
		 

	    function makeLinks(){
		
		var depList; //each element of Dependencies List
		var depLink; //ready string row for adding to the return ArrayList 
		var addSymbol = 0; //Define if the next package is alternate
		

		//For each element in depends applications find the app in main package list
		for (depList of arrayListDep){

			
		    //Defining of alternitives packages
		    if (depList == "|"){
			addSymbol = 1;
		    }else if(depList == ","){
			//do nothing, next loop
		    }else if (depList == " "){
			//next loop
		    }else if (depList == ""){
			//next loop
		    }
		    
		    else {
			
			//Add '|' symbol if the previous row includes '|'
			if (addSymbol == 1){
			    depList = "| " + depList;
			    addSymbol = 0;
			}


			var helpArray = []; //Array include package name and package Id
			var dependsName = ""; //It is also possible to use the default name of the package

			//Add all packages names that includes the similar names   
			for (var sInPs=0; sInPs < packageList.length; sInPs++){

			    var delC = depList.split(",")[0];

			    if (delC === packageList[sInPs].split('\n')[0] ) {
				helpArray.push([(packageList[sInPs].split('\n'))[0], sInPs]);
			    }
					

			}

			//The package was not found in the main list
			//Mark this package with ID=-1
			if (helpArray === undefined || helpArray.length == 0) {
				helpArray.push([depList, -1]);
			}
				    
			//=====For dependencies=====

			//If the package is not on the main list, but it is mentioned in the
			//dependencies
			if (helpArray[0][1] === -1){

			    depLink = "<a>" +  depList + "</a>"; 
			}else {
			    
			    //To use the original name packege with version number should write
			    //'depList' instead 'dependsName'
			    depLink = "<a onclick='showDetails(" + helpArray[0][1] + ")' href='#'>" + helpArray[0][0] + "</a>"; 

			}

			//Add link to dependencies 
			dependsArray.push(depLink);

		    }
		


		}
	    }//end of additing links
	    
	    //If there is no any dependencies return info message
	    if (dependsArray === undefined || dependsArray.length == 0) {
		dependsArray.push("There is no any dependencies");
	    }

	    return dependsArray;
	}	
    }


export default UploadFile;
