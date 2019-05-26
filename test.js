


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


class DOT{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.nextDots = new Array();
        this.initialDistance = new Array();

        this.isFixed = 0;
        this.force = [0, 0];
        this.k = 10;
    }

    addNextDot(dot){
        if(!(dot instanceof DOT)){
            throw "arg is not a dot";
        }

        this.nextDots.push(dot);
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, 2*Math.PI, true);
        ctx.fill();
    }

    distanceTo(dot){
        if(!(dot instanceof DOT)){
            throw "arg is not a dot";
        }

        const x1 = this.x;
        const y1 = this.y;
        const x2 = dot.x;
        const y2 = dot.y;
        const distance2 = (x1-x2)**2 + (y1-y2)**2;
        const distance = Math.sqrt(distance2);
        
        return distance;
    }

    getNetForce(){
        const k = 1;//弾性係数
        const net_force = [0, 0];
        for(let i=0;i<this.nextDots.length;i++){
            const d = this.distanceTo(this.nextDots[i]);
            
            const force_dir = [-this.x+this.nextDots[i].x, -this.y+this.nextDots[i].y];
            // force dirを単位ベクトルに正規化
            const norm = Math.sqrt(force_dir[0]**2 + force_dir[1]**2);
            force_dir[0] /= norm;
            force_dir[1] /= norm;

            const l = this.initialDistance[i];

            const force_x = force_dir[0]*(d - l)*k;
            const force_y = force_dir[1]*(d - l)*k;

            net_force[0] += force_x;
            net_force[1] += force_y;
        }

        net_force[0] += this.force[0];
        net_force[1] += this.force[1];

        return net_force;
    }

    next(){
        if(this.isFixed){
            return;
        }
        const dx = 0.4;
        const force = this.getNetForce();

        this.x += force[0]*dx;
        this.y += force[1]*dx;
    }
}

const dots = new Array();
for(let x=0;x<200;x+=10){
    for(let y=0;y<100;y+=10){
        const dot = new DOT(x+5, y+5);
        if(x===0){
            dot.isFixed = 1;
        }
        if(x===190){
            dot.force = [8, 0];
        }
        dots.push(dot);
    }
}


const connectNextDots = ()=>{
    const threshold = 10*1.5;
    for(let i=0;i<dots.length-1;i++){
        for(let j=i+1;j<dots.length;j++){
            const distance = dots[i].distanceTo(dots[j]);
            if(distance<threshold){
                dots[i].addNextDot(dots[j]);
                dots[j].addNextDot(dots[i]);
                dots[i].initialDistance.push(distance);
                dots[j].initialDistance.push(distance);
            }
        }
    }
};

const next = ()=>{
    for(const e of dots){
        e.next();
    }

    ctx.clearRect(0, 0, 500, 500)

    for(const e of dots){
        e.draw();
    }
};

connectNextDots();
setInterval(() => {
    next();
}, 10);