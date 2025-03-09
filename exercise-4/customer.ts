export class Customer{
    private firstName : string;
    private lastName: string;
    private age: number;

    constructor(firstName: string, lastName: string, age:number){
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }
    public greeter(){
        console.log(`Hello ${this.firstName} ${this.lastName}`);
    }  
    GetAge(){
        return this.age
    }
}
let customer = new Customer("Param", "Patel",30);
customer.greeter();
console.log(customer.GetAge());