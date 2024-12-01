import { Component, OnInit } from '@angular/core';
import { NewsService } from 'app/Services/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss', '../../app.component.css','../../../styles.css']
})
export class NewsComponent implements OnInit {

  public newsArray: Array<any> 
  constructor(private news: NewsService) { }

  ngOnInit(): void {
      this.newsArray = []
    this.news.getNews().subscribe({
      next:(res)=>{
        this.newsArray = res.body["data"]['articles']
        console.log(this.newsArray)
      },error:(err)=>{

      }
    })
  }
  openNewTab(link:string){
    window.open(link)
  }
}
