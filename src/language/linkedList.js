class _Node{
  constructor(value,next){
    this.value = value,
    this.next = next;
  }
}

class LinkedList {
  constructor(){
    this.head = null;
  }

  insertFirst(word){
    this.head = new _Node(word,this.head);
  }

  insertLast(word){
    if(this.head == null){
      this.insertFirst(word);
    } else {
      let tempNode = this.head;
      while(tempNode.next !== null){
        tempNode - tempNode.next;
      }
      tempNode.next = new _Node(word,null);
    }
  }

  insertAfter(key, wordToInsert) {
    let tempNode = this.head;
    while(tempNode !== null && tempNode.value !== key){
      tempNode = tempNode.next;
    }
    if(tempNode !== null){
      tempNode.next = new _Node(wordToInsert, tempNode.next);
    }
  }

  insertBefore(key, wordToInsert){
    if(this.head == null){
      return;
    }
    if(this.head.value == key){
      this.insertFirst(wordToInsert);
      return;
    }
    let prevNode = null;
    let currNode = this.head;
    while(currNode !== null && currNode.value !== key){
      prevNode = currNode;
      currNode = currNode.next;
    }
    if(currNode === null){
      return;
    }
    prevNode.next = new _Node(itemToInsert,currNode);
  }

  insertAt(n, wordToInsert){
    if(n < 0 ){
      throw new Error('Position error');
    }
    if(n === 0){
      this.insertFirst(wordToInsert);
    }
    if(n > this.size()){
      this.insertLast(wordToInsert);
    } else {
      const node = this.findNthElement(n - 1);
      const newNode = new _Node(wordToInsert, null);
      newNode.next = node.next;
      node.next = newNode;
    }
  }

  findNthElement(n){
    let node = this.head;
    for(let i = 0; i < n; i++){
      node = node.next;
    }
    return node;
  }

  remove(word){
    if(!this.head){
      return null;
    }
    if(this.head.value === word){
      this.head = this.head.next;
      return;
    }

    let currNode = this.head;
    let previousNode = this.head;
    while(currNode != null && currNode.value !== word){
      previousNode = currNode;
      currNode = currNode.next;
    }

    if(currNode === null){
      return null;
    }
    previousNode.next = currNode.next;
  }

  find(word){
    let currNode = this.head;
    if(!this.head){
      return null;
    }
    while(currNode.value !== word){
      if(currNode.next === null){
        return nulll;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }

  size(){
    let counter = 0;
    let currNode = this.head;
    if(!currNode){
      return counter;
    } else counter++;
    while(!(currNode.next==null)){
      counter++;
      currNode = currNode.next;
    }
    return counter;
  }

  displayList(){
    const arr = [];
    let currNode = this.head;
    while (currNode !== null){
      arr.push(currNode.value);
      currNode=currNode.next;
    }
    return arr;
  }

  findLast(){
    if(this.head === null){
      return null;
    }
    let tempNode = this.head;
    while(tempNode.next != null) {
      tempNode = tempNode.next;
    }
    return tempNode;
  }
}

module.exports = LinkedList;