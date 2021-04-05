import React from 'react';
import axios from "axios";
import PagesTitle from "../props/utils/PagesTitle";


class LivretFormation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pages: 1,
            list: [],
            data: false,

        }
        this.getdata = this.getdata.bind(this);
        this.prevpage = this.prevpage.bind(this);
        this.nextpage = this.nextpage.bind(this);
    }

     componentDidMount() {
        this.getdata()
    }
    async getdata(){
        let req = await axios({
            url: '/data/formations/get/' + this.state.page + '/4',
            method: 'GET'
        })
        if(req.status === 200){
            this.setState({
                list: req.data.formations,
                pages: req.data.pages,
                data:true,
            })
        }
    }

    prevpage(){
        if(this.state.page > 1){
            let page = this.state.page - 1;
            this.setState({page,data:false})
            this.getdata()
        }
    }

    nextpage(){
        if(this.state.page !== this.state.pages){
            let page= this.state.page + 1;
            this.setState({page,data:false})
            this.getdata()
        }
    }

    render() {
        return (<div className="livret-page">
                <PagesTitle title={'Mon livret de formation'}/>
            <div className={'livret'}>
                <div className="livret-content">
                    <section>
                    {this.state.data === true && this.state.list.map((forma) =>
                        <div className={'forma'} onClick={()=>{this.props.change(1,forma.id)}}>
                            <div className="infos">
                                <img src={"/storage/front_img/"+forma.id+'/'+forma.image} alt={""}/>
                                <div className="text">
                                    <h5>{forma.name}</h5>
                                    <p>{forma.desc}</p>
                                </div>
                            </div>
                            <div className="validation">
                                <h3>résulat</h3>
                                {forma.validate ? <img src={'https://as2.ftcdn.net/jpg/00/20/19/65/500_F_20196541_1AaZysgM7wGN4HyYeXH1XCjVLLPELIWC.jpg'} alt={''}/> : ''}
                            </div>
                        </div>
                    )}
                    </section>
                </div>
                <div className="livret-footer">
                    <button className={'btn'} onClick={()=>{this.prevpage()}} disabled={this.state.page === 1}>Page précédente</button>
                    <button className={'btn'} onClick={()=>{this.nextpage()}} disabled={this.state.page === this.state.pages}>Page suivante</button>
                </div>
            </div>
        </div>);
    }
}

class ResponsePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            trystart: '',
            formation: {},
            responses: {},
            length: 1,
            actuel: 1,
            incorrect: false,
            myresponses: {},
        }

        this.nextPage = this.nextPage.bind(this)
    }

    async componentDidMount() {
        var req = await axios({
            url: '/data/formations/' + this.props.id + '/get',
            method: 'GET'
        })
        if(req.status === 500){
            this.props.change(null)
        }
        if(req.status === 200){
            let length = req.data.formation.get_questions.length +1;
            length = length + (req.data.formation.displaynote === 1 ? 1 : 0)

            this.setState({formation: req.data.formation, responses: req.data.formation.get_questions, length:length})
        }
    }

    componentWillUnmount() {

    }

    nextPage(){
        if(this.state.actuel === this.state.length){

        }else{
            if(this.state.actuel === 0){
                this.setState({actuel: this.state.actuel+1, incorrect:false});
            }else{
                if(this.state.formation.correction){
                    if(this.state.incorrect){
                        this.setState({actuel: this.state.actuel+1, incorrect:false});
                    }else{
                        this.setState({incorrect:true});
                        this.ScoreCouter();
                    }
                }else{
                    this.ScoreCouter();
                    this.setState({actuel: this.state.actuel+1});
                }
            }
        }
    }

    async ScoreCouter() {
        let point = 0;
        let responses = this.state.myresponses;
        let rightresponses = this.state.responses[this.state.actuel - 1 - (this.state.formation.displaynote === 1 ? 1 : 0)].responses;
        let a = 0;
        while (a < rightresponses.length) {
            if (responses.hasOwnProperty(rightresponses[a].id)) {
                point = (responses[rightresponses[a].id].value === rightresponses[a].active ? point+1 : point-1)
            } else {
                point = (rightresponses[a].active === false ? point+1 : point-1)
            }
            a++;
        }
        if (point < 0) {
            point = 0;
        }
        let path = this.state.responses[this.state.actuel - 1 - (this.state.formation.displaynote === 1 ? 1 : 0)].id

        await axios({
            url: '/data/formations/response/' + path + '/save',
            method: 'POST',
            data: {
                points: point,
            }
        })
    }

    render() {
        return (
            <div className="responsepage">
                <PagesTitle title={"formation | " + this.state.formation.name}/>
                <div className="responsecontent">
                        <section className="question">
                            {this.state.actuel === 0 &&
                                <div className={'question-infos'}>

                                </div>
                            }
                            {this.state.actuel > 0 && this.state.actuel < this.state.length &&
                                <div className={'left'}>
                                    <h2><span>Question n°{this.state.actuel} :</span> {this.state.responses[this.state.actuel - 1 - (this.state.formation.displaynote === 1 ? 1 : 0)].name}</h2>
                                    <div className={"response"}>
                                    {this.state.responses[this.state.actuel - 1 - (this.state.formation.displaynote === 1 ? 1 : 0)].responses.map((response)=>
                                        <div className={'rowed'} key={response.id}>
                                            <div className={'checkbox'}>
                                                <label className={"container " + (this.state.incorrect ? (response.active ? 'right':'') : '')} >{response.content}
                                                    <input type="checkbox" className={'user '} disabled={this.state.incorrect} checked={((this.state.myresponses.hasOwnProperty(response.id)) ? this.state.myresponses[response.id].value : false)} onChange={()=>{
                                                        let array = this.state.myresponses;
                                                        if(array.hasOwnProperty(response.id)){
                                                            array[response.id] = {
                                                                value: !this.state.myresponses[response.id].value
                                                            }
                                                        }else{
                                                            array[response.id] = {
                                                                value: true
                                                            }
                                                        }
                                                        this.setState({myresponses: array})
                                                    }}/>
                                                    <span className="checkmark" />
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            }
                            {this.state.actuel >  0 && this.state.actuel < this.state.length &&
                                <div className="infos">
                                <img alt={""} src={'/storage/formations/question_img/'+ (this.state.responses[this.state.actuel - 1 - (this.state.formation.displaynote === 1 ? 1 : 0)].id) + '/' + this.state.responses[this.state.actuel - 1 - (this.state.formation.displaynote === 1 ? 1 : 0)].img}/>
                                <p>{this.state.responses[this.state.actuel - 1 - (this.state.formation.displaynote === 1 ? 1 : 0)].desc}</p>
                                {this.state.incorrect &&
                                    <section className={'correction'}>
                                        <p>{this.state.responses[this.state.actuel - 1 - (this.state.formation.displaynote === 1 ? 1 : 0)].correction}</p>
                                    </section>
                                }
                            </div>
                            }
                            {this.state.actuel === this.state.length &&
                                <div className={'question-end'}>

                                </div>
                            }
                        </section>

                        <section className="bottom">
                            <h3>1 mins 27</h3>
                            {this.state.actuel > 0 && this.state.actuel < this.state.length &&
                                <h3>{this.state.responses[this.state.actuel - 1 - (this.state.formation.displaynote === 1 ? 1 : 0)].type}</h3>
                            }
                            <button className={'btn'} type={'submit'} onClick={this.nextPage}>valider</button>
                        </section>
                </div>
            </div>

        );
    }
}

class FormationsController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 1,
            formaid: 19,
        }
        this.changePage = this.changePage.bind(this)
    }

    changePage(status, formaid=null){
        this.setState({status, formaid})
    }

    render() {
        switch (this.state.status){
            case null:
                return (<LivretFormation change={this.changePage}/>)
            case 1:
                return (<ResponsePage change={this.changePage} id={this.state.formaid}/>)
        }
    }
}
export default FormationsController;
