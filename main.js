const carCanvas=document.getElementById("carCanvas");
carCanvas.width=500;
//const networkCanvas=document.getElementById("networkCanvas");
//networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
//const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=500;
const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){//save the brain in localstorage and next time take this value of best brain car
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.01);
        }
    }
}

const traffic=[
    new Car(road.getLaneCenter(1),-100,50,80,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,50,80,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,50,80,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,50,80,"DUMMY",2),
    new Car(road.getLaneCenter(1),-500,50,80,"DUMMY",2),
    new Car(road.getLaneCenter(1),-700,50,80,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,50,80,"DUMMY",2),
];

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,50,80,"AI"));
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)//find the car with minimum y value and make it best car
        ));

    carCanvas.height=window.innerHeight;
    //networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.2;//making things transparent
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);

    carCtx.restore();

    //networkCtx.lineDashOffset=-time/50;
    //Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}