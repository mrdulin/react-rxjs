import * as React from 'react';
import { requestBooks, clearBooks } from '../../actions/book';
import { connect } from 'react-redux';
import * as Rx from 'rxjs';
import { ISubscriptionObject, ISubjectObject } from '../../interfaces';
import { BookModule } from '../../reducers/books';

interface IProps {
  bookModules: any
}

interface IActions {
  requestBooks: (names: string[]) => void;
  clearBooks(): void;
}

type Props = IProps & IActions;

class Container extends React.PureComponent<Props, any> {

  private subjects: ISubjectObject<any> = {};
  private subscriptions: ISubscriptionObject = {};

  public static defaultProps: IProps = {
    bookModules: {}
  }

  public constructor(props: Props) {
    super(props);
    this.subjects.getBooksButton = new Rx.Subject();
    this.subjects.retryButton = new Rx.Subject();

    this.subscriptions.getBooksButtonSub = this.subjects.getBooksButton.sampleTime(2000).subscribe(this.onRequestBookObserver);
  }

  public componentWillMount() {
    console.log('componentWillMount');
    // 在此dispatch action，render方法中props上取到state依旧是旧的，
    // 只有在组件下一轮render(经过mapStateToProps -> componentWillReceiveProps -> shouldComponentUpdate -> render)的时候，才能拿到最新的state数据
    this.props.clearBooks();
  }

  public componentWillUnmount() {
    this.subscriptions.getBooksButtonSub.unsubscribe();
  }

  public render() {
    console.count('render count');
    const { bookModules } = this.props;

    console.log('bookModules', bookModules);

    return (
      <section>
        <button type='button' onClick={() => this.onRequestBook(['react', 'angular', 'javascript'])}>get books</button>

        {
          Object.keys(bookModules).map((name: string, idx: number) => {
            const bookModule: BookModule = bookModules[name];
            const books: any[] | undefined = bookModule.Books;
            const isLoading: boolean = bookModule.isLoading;
            return (
              <div key={name}>
                <h3>{name}</h3>
                {
                  isLoading ? <p>模块加载中...</p> :
                    (
                      books && !bookModule.error ?
                        <ul>
                          {
                            books.map((book: any, idx: number) => {
                              return (
                                <li key={idx}>{book.Title}</li>
                              );
                            })
                          }
                        </ul> : <div>
                          <p>{bookModule.message}</p>
                          <button type='button' onClick={() => this.onRequestBook([name])}>重新尝试请求数据</button>
                        </div>
                    )
                }
              </div>
            )
          })
        }

      </section>
    );
  }

  private onRequestBook(names: string[]) {
    this.subjects.getBooksButton.next(names);
  }

  private onRequestBookObserver = (names: string[]) => {
    this.props.requestBooks(names);
  }

}

export default connect(
  ({ bookModules }) => ({ bookModules }),
  ({ requestBooks, clearBooks })
)(Container);
