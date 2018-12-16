<template>
    <div>
        <div class="game container">
            <div v-for="(value, key) in rows" v-bind:id="'row' + key" class="row line">
                <!-- pawns background -->
                <div v-for="i in nb_pawn" class="pawn back" v-bind:style="'left:'+((i-1)*40)+'px;'"></div>
                <!-- pawns -->
                <a href="#" v-for="color in value" class="pawn" v-bind:class="color">
                    <span>{{ color }}</span>
                </a>
                <!-- correction -->
                <div class="corrections">
                    <div class="correction" v-for="pin in correction[key]" v-bind:class="pin"></div>
                </div>
            </div>
            <div class="row picker">
                <a href="#" v-for="color in colors" v-on:click="putColor(color)" class="pawn" v-bind:class="color">
                    <span>{{ color }}</span>
                </a>
            </div>
        </div>

        <div class="modal" id="message">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Information</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>{{ message }}</p>
                        <p>La solution est :</p>
                        <div class="line">
                            <a v-for="color in solution" class="pawn" v-bind:class="color">
                                <span>{{ color }}</span>
                            </a>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['nb_rows','nb_pawn'],
        data(){
            return {
                colors : [
                    'blue',
                    'red',
                    'white',
                    'yellow',
                    'green',
                    'orange',
                    'purple',
                    'pink'
                ],
                rows : this.initRows(),
                correction : this.initCorrection(),
                currentRow : 0,
                gameover : false,
                message : ''
            }
        },
        created: function () {
            let solution = [];
            for(let i = 0; i < this.nb_pawn; i++){
                let pawn = this.colors[this.mtRand(0, this.colors.length - 1)];
                solution.push(pawn);
            }
            console.log(solution);
            this.solution = solution;
        },
        methods: {
            initRows : function(){
                let rows = [];
                for(let i = 0; i < this.nb_rows; i++){
                    rows[i] = [];
                }
                return rows;
            },
            initCorrection : function(){
                let corrections = [];
                for(let i = 0; i < this.nb_rows; i++){
                    corrections[i] = [];
                }
                return corrections;
            },
            putColor : function(color) {
                if(!this.gameover){
                    if(this.rows[this.currentRow].length < this.nb_pawn) {
                        this.rows[this.currentRow].push(color);
                        if(this.rows[this.currentRow].length === this.nb_pawn){
                            this.makeCorrection();
                            if(this.checkWin()){
                                let shot = this.currentRow + 1;
                                if(shot === 1) {
                                    this.showMessage('Bravo, tu as réussi en 1 coup !')
                                }else{
                                    this.showMessage('Bravo, tu as réussi en ' + shot + ' coups !')
                                }
                                this.gameover = true;
                            }else {
                                if (this.currentRow === this.rows.length - 1) {
                                    this.showMessage('Désolé c\'est perdu pour cette fois')
                                    this.gameover = true;
                                }
                                this.currentRow++;
                            }
                        }
                    }
                }
            },
            showMessage : function(msg){
                this.message = msg
                $('#message').modal('show')
            },
            checkWin : function(){
                if(this.correction[this.currentRow].length !== this.nb_pawn){
                    return false;
                }
                for(let i in this.correction[this.currentRow]){
                    if(this.correction[this.currentRow][i] !== 'red'){
                        return false;
                    }
                }
                return true;
            },
            makeCorrection : function(){
                // copy object to not alter them
                let row = Object.assign([], this.rows[this.currentRow]);

                // row id matching solution id
                let match = {};

                // red check
                for(let i in row){
                    if(this.solution[i] === row[i]){
                        this.correction[this.currentRow].push('red');
                        match[i] = i.toString();
                    }
                }

                // white check
                for(let i in row){
                    for(let searchIndex = 0; searchIndex < this.nb_pawn; searchIndex++) {
                        if(match[i] === undefined) {
                            let solutionIndex = this.solution.indexOf(row[i], searchIndex);
                            if (solutionIndex !== -1 && !this.inObject(match, solutionIndex.toString())) {
                                this.correction[this.currentRow].push('white');
                                match[i] = solutionIndex.toString();
                            }
                        }
                    }
                }
            },
            inObject : function(obj, value){
                for(let i in obj){
                    if(obj[i] === value){
                        return true;
                    }
                }
                return false;
            },
            mtRand : function(min, max){
                return Math.floor(Math.random() * (max - min + 1)) + min
            }
        }
    }
</script>