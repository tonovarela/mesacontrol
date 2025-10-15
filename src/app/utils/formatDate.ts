 export const formatDate=(dateString: string,withTime=true ): string =>{
  
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son base 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');  
    if(withTime){
    return `${day}-${month}-${year} ${hours}:${minutes} hrs`;
      
    }
    return `${year}-${month}-${day}`;
  }

  