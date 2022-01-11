import { Router } from "@vaadin/router";
import { state } from "../../state";

class AccesRoom extends HTMLElement {
  // connectedCallback es el cb q tenemos que usar en los custom-elements para escribir de forma segura
  connectedCallback() {
    //aca seteamos al html
    this.render();
    const cs = state.getState();

    const enterRoomForm = document.querySelector(".enterRoom__form") as any;
    const enterSecondPlayerForm = document.querySelector(
      ".enterSecondPlayer__form"
    ) as any;

    // formulario de segundo jugador

    enterSecondPlayerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const nameUser2 = target.nombre.value;

      state.setUser2Name(nameUser2);
      state.signInUser2((err) => {
        if (err) console.error("hubo un error en el signIn");
      });

      enterSecondPlayerForm.style.display = "none";
      enterRoomForm.style.display = "initial";
    });

    // formulario de ingresar a una sala

    enterRoomForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const roomIdEl = target.roomId.value;
      cs.roomId = roomIdEl;

      state.accessToRoom(() => {
        state.setPlayer2ValuesRtdb();
        state.listenRoom();

        state.subscribe(() => {
          if (
            cs.dataRtdb[0].online == false ||
            cs.dataRtdb[1].online == false
          ) {
            console.error("Some player is not connected");
          }
          if (cs.dataRtdb[0].online == true && cs.dataRtdb[1].online == true) {
            Router.go("/instructions");
          }
        });
      });
    });
  }
  render() {
    this.innerHTML = `
      <section class="welcome">
        <div class="welcome__title">
          <my-text tag="h1">Piedra Papel ó Tijera</my-text>
        </div> 

        <div class="welcome__container-enterRoom"> 

          <form class="enterSecondPlayer__form">
            <label class="enterSecondPlayer__form-label"><my-text tag="h4">Tu Nombre</my-text></label>
            <input class="input enterSecondPlayer-input" required name="nombre"/>
            <button class="enterSecondPlayer-button button">Empezar</button>
          </form>

          <form class="enterRoom__form">
            <input class="input enterRoom__form-input" placeholder="código" name="roomId">
            <button class="enterRoom__form-button button">Ingresar a la sala</button>
          </form>

        </div>

        <div class="welcome__hands">
          <my-hands></my-hands> 
        </div>
      </section>
    `;
  }
}

customElements.define("access-room-page", AccesRoom);
