import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { PokemonSocketService } from '../pokemon-socket.service';
import { AuthService } from '../auth.service';
import { GameFactoryService } from '../game-factory.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  message = '';
  user = {
    email: '',
    name: '',
    gameId: -1
  };
  gameName = '';
  gameCreator = '';
  gameCreatorName = '';
  myGameCreator = false;
  users = [];

  constructor(
    private pokeSocket: PokemonSocketService,
    private auth: AuthService,
    private router: Router,
    private gameService: GameFactoryService
  ) { 

  }

  ngOnInit() {
    setTimeout( () => this.setUp(), 0);
  }

  setUp() {
    if ( !this.auth.isAuth( 'lobby' ) ) {
      this.router.navigate([ '/signin' ]);
    }
    else {
      
      const user = this.auth.getCurrentUser();
      this.user = { ...this.user, ...user };

      if ( this.user.gameId === -1 ) {
        this.router.navigate([ '/home' ]);
        return;
      }

      this.initialize();

      this.pokeSocket.register( 'join-Lobby', (currentUsers) => {
        this.users = currentUsers;
      });
    
      this.pokeSocket.register( 'currentUsers', (userArray) => {
        this.users = userArray;
      });
    
      this.pokeSocket.register( 'moveAllPlayersToSelectPokemon', ( ) => {
        this.router.navigate([ '/starter' ])
        .catch( console.error );
      });
    
      // Updates players in room, if a player leaves lobby and goes to home page
      this.pokeSocket.register( 'user update', (userArrayUpdated) => {
        this.users = userArrayUpdated;
      });

    }
  }

  initialize = () => {
    this.gameService.lobbyInit( this.user.gameId )
    .subscribe( (resp: any) => {
      this.gameName = resp.gameName;
      this.gameCreator = resp.gameCreator;
      this.gameCreatorName = resp.creatorName;
      if ( this.gameCreator === this.user.email ) {
        this.myGameCreator = true;
      } 
      this.pokeSocket.emit( 'enteredLobby', { gameId: this.user.gameId } );

    });
  }

  getStarterView = () => {
    this.gameService.addUsers( this.user.gameId, this.users )
    .subscribe( (resp: any) => {
      this.pokeSocket.emit( 'creatorStartsGame', { gameId: this.user.gameId } );
    });
  }

  printstate() {
    console.log( '\nuser:', this.user );
    console.log( 'message:', this.message );
    console.log( 'gameCreator:', this.gameCreator );
    console.log( 'gameCreatorName:', this.gameCreatorName );
    console.log( 'myGameCreator:', this.myGameCreator );
    console.log( 'users:', this.users );
  }

}