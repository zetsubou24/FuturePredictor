import json
from collections import defaultdict
class Node:
    def __init__(self,a,b,c):
        self.a=a
        self.b=b
        self.c=c
        self.next=None
        self.prev=None
class Iterator:
    def __init__(self):
        self.dict={}
        self.locationdict={}
        self.pointer=0
        
        with open('./location_history_102014.json') as f:
            data = json.load(f)
        locs=data['locations']
        locs=list(locs)
        # print(locs[-1:-3:-1])
        locs.sort(key=lambda x:x['timestampMs'])
        self.locs=locs
        self.buildIterator(locs)
    def getCurrentIndex(self):
        return self.pointer
    def getCurrentLocations(self):
        return [self.dict[self.pointer].a,self.dict[self.pointer].b,self.dict[self.pointer].c]
    def getNext(self):
        if self.pointer +1>=len(self.locs)-2:
            return None
        self.pointer+=1
        return self.dict[self.pointer].a
    def getPrev(self):
        if self.pointer-1<0:
            return None
        self.pointer-=1
        return self.dict[self.pointer].a
    def getNextVal(self,a,b,c):
        string=str(a)+"#"+str+(b)+"#"+str(c)
        return locationdict[string]
        
    def setPointerToCurrent(self,a,b,c):
        flag=0
        pp=[a,b,c]
        for i in range(len(self.locs)-3):
            # print([self.dict[i].a,self.dict[i].b,self.dict[i].c])
            if pp==[self.dict[i].a,self.dict[i].b,self.dict[i].c]:
                self.pointer=i
                flag=1
                break
        if flag==0:
            print("Sequence not found")
            return 0
        return 1
    def buildIterator(self,li):
        current=None
        start=None
        curpointer=0
        for i in range(len(li)-3):
            a,b,c=[li[i]['longitudeE7']/1e7,li[i]['latitudeE7']/1e7],[li[i+1]['longitudeE7']/1e7,li[i+1]['latitudeE7']/1e7],[li[i+2]['longitudeE7']/1e7,li[i+2]['latitudeE7']/1e7]
            d=[li[i+3]['longitudeE7']/1e7,li[i+3]['latitudeE7']/1e7]
            curnode=Node(a,b,c)
            string=str(a)+"#"+str(b)+"#"+str(c)
            if start is None:
                start=curnode
                current=start  
            else:
                current.next=curnode
                current=current.next
            self.dict[curpointer]=curnode
            curpointer+=1
            self.locationdict[string]=d
        
obj=Iterator()
# print(obj.dict)
print(obj.getNext())
print(obj.setPointerToCurrent([-3.6332096, 40.4207929], [-3.6332096, 40.4207929], [-3.6332096, 40.4207929]))
print(obj.getCurrentIndex())
print(obj.getCurrentLocations())
        
        
        
        
        
        


    