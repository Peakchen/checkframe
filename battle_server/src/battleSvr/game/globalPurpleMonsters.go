package game

/*
	运动小球实体集合
*/

import (
	//"common"
	//"sync"
	"common/AsyncLock"
	"common/rediscache"
	"common/cache"
)

type GlobalPurpleMonsters struct {
	rediscache.IDBModule

	Monsters map[uint32]MosterState
}

const (
	module_GlobalPurpleMonsters = string("GlobalPurpleMonsters")
)

func (this *GlobalPurpleMonsters) Identify() string{
	return module_GlobalPurpleMonsters
}

func GetGlobalPurpleMonsters()(this *GlobalPurpleMonsters){
	this = &GlobalPurpleMonsters{}
	this.StrIdentify = module_GlobalPurpleMonsters
	err, succ := cache.GetDecodeCache(this.Identify(), this)
	if !succ {
		panic(err)
	}

	if err != nil {
		this = &GlobalPurpleMonsters{
			Monsters: map[uint32]MosterState{},
		}

		err := cache.SetEncodeCache(this.Identify(), this)
		if err != nil {
			panic(err)
		}
	}

	if this.Monsters == nil {
		this.Monsters = map[uint32]MosterState{}
	}

	return
}

func (this *GlobalPurpleMonsters) UpdateCache(){
	err := cache.SetEncodeCache(this.Identify(), this)
	if err != nil {
		panic(err)
	}
}

func (this *GlobalPurpleMonsters) GetAll()map[uint32]MosterState{
	return this.Monsters
}

func (this *GlobalPurpleMonsters) Online(id uint32) {
	AsyncLock.AddZKLock("global", module_GlobalPurpleMonsters)
	defer AsyncLock.ReleaseZKLock("global", module_GlobalPurpleMonsters)

	this.Monsters[id] = MosterState_Online
}

func (this *GlobalPurpleMonsters) Offline(id uint32) {
	AsyncLock.AddZKLock("global", module_GlobalPurpleMonsters)
	defer AsyncLock.ReleaseZKLock("global", module_GlobalPurpleMonsters)

	this.Monsters[id] = MosterState_Offline
} 
