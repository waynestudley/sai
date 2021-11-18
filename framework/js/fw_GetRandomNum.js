/*----------------------------------------
	Name: fw_GetRandomNum.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_GetRandomNum(maxNum){		
	var _maxNum = maxNum;
	var _randNums= new Array();	
	this.getNum=getNum;	
	function getNum(){
		var index = 0;		
		if (_randNums != null){
			var found = false;
			while (!found)
			{
				index = Math.round(Math.random() * _maxNum);
				
				found = true;
				for (var i = 0; i < _randNums.length; i++)
				{
					if (index == _randNums[i])
					{
						found = false;
						break;
					}
				}
				
			}
			
		}else{
			index = Math.round(Math.random() * _maxNum);
			
		}		
		_randNums.push(index);
		return index;
	}	
}
