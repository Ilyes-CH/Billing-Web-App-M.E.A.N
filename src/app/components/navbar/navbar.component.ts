import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserService } from 'app/Services/user.service';
import { AuthService } from 'app/Services/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css','../../app.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    private socket!: WebSocket;
    public notifications : Array<any> =[]
    public isAccountant : boolean = false
    public userName : string 
    public avatar : string 


    constructor(private activatedRoute: ActivatedRoute,private auth:AuthService,location: Location, private element: ElementRef, private router: Router, private userService: UserService) {
        this.location = location;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.auth.notifications$.subscribe((notif) => {
            this.notifications = notif;
            console.log('Updated Notifications:', this.notifications);
        })
        const token = sessionStorage.getItem('accessToken')
        if(token){
            //logout logic
            const decoded = jwtDecode(token)
            if(decoded['role'] =="Accountant"){
                this.isAccountant = true
            }
            this.userName = `${decoded['firstName']} ${decoded['lastName']}`
            this.avatar = decoded['avatar']
       
       
            const currentTime = Math.floor(Date.now() / 1000)
            if(currentTime > decoded.exp){
                console.log('access token is expired')
                sessionStorage.removeItem('accessToken')
                this.router.navigate(["login"])
            }
        }
        const port = 3000;

        if (token) {
            const decoded = jwtDecode(token)
            if (decoded['role'] == "Accountant") {

                const wsUrl = `ws://127.0.0.1:${port}?token=${encodeURIComponent(token)}`;
                this.socket = new WebSocket(wsUrl, [token]);  // Send token as protocol

                this.socket.onopen = () => {
                    console.log('Connected to WebSocket server.');
                };

                this.socket.onmessage = (event) => {
                    const data = JSON.parse(event.data) 
                    console.log('Message received from server:', data);
                    this.userService.getUserById(data.from).subscribe((res)=>{
                        if(res.ok){
                            this.notifications.push({...data,from:res.body['data']})
        
                            localStorage.setItem('notifications',JSON.stringify(this.notifications))
                            console.log(res.body)
                        }
                        
                    })
                };

                this.socket.onclose = () => {
                    console.log('Disconnected from WebSocket server.');
                };

                this.socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };
            } else {
                console.error('Access token not found. WebSocket connection aborted.');
            }
        }



        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });
    }


    goToCreateNotice(id:string){
        console.log(id)
                this.router.navigate([`create-notice/${id}`])
    }

    sidebarOpen() {

        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function () { //asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }

        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Bootcamp';
    }
}
