import React, { useCallback, useEffect, useState } from 'react';
import {
  Layout,
  Input,
  Row,
  Col,
  Card,
  Tag,
  Spin,
  Alert,
  Modal,
  Typography,
  Rate,
  Pagination,
  Button,
} from 'antd';
import 'antd/dist/antd.css';
import { DollarCircleFilled } from '@ant-design/icons';
import { getSearchedMovies } from '../../services/movieServices';
import { useHistory } from 'react-router';
import { fakeAuth } from '../../helper/auth';

const API_KEY = 'ab8e3a90';
const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Meta } = Card;
const TextTitle = Typography.Title;

const ColCardBox = ({ Title, imdbID, Poster, Type, ShowDetail, DetailRequest, ActivateModal }) => {

  const clickHandler = () => {
    ActivateModal(true);
    DetailRequest(true);

    fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
      .then(resp => resp)
      .then(resp => resp.json())
      .then(response => {
        DetailRequest(false);
        ShowDetail(response);
      })
      .catch(({ message }) => {
        DetailRequest(false);
      })
  }

  return (
    <Col style={{ margin: '20px 0' }} className="gutter-row" span={5}>
      <div className="gutter-box">
        <Card
          style={{ width: 200 }}
          cover={
            <img
              style={{ maxHeight: 250, minHeight: 250 }}
              alt={Title}
              src={Poster === 'N/A' ? 'https://placehold.it/198x264&text=Image+Not+Found' : Poster}
            />
          }
          onClick={() => clickHandler()}
        >
          <Meta
            title={Title}
            description={false}
          />
          <Row style={{ marginTop: '10px' }} className="gutter-row">
            <Col>
              <Tag color="magenta">{Type}</Tag>
            </Col>
          </Row>
        </Card>
      </div>
    </Col>
  )
}

const MovieDetail = ({ Title, Poster, imdbRating, Rated, Runtime, Genre, Plot, Year, Actors, Director,
  Awards, Production, Ratings, Metascore, BoxOffice, Released, }) => {
  return (
    <Row>
      <Col span={11}>
        <img
          src={Poster === 'N/A' ? 'https://placehold.it/198x264&text=Image+Not+Found' : Poster}
          alt={Title}
        />
      </Col>
      <Col span={13}>
        <Row>
          <Col span={21}>
            <TextTitle level={4}>{Title}</TextTitle></Col>
          <Col span={3} style={{ textAlign: 'right' }}>
            <TextTitle level={4}><span style={{ color: '#41A8F8' }}>{imdbRating}</span></TextTitle>
          </Col>
        </Row>
        <Row style={{ marginBottom: '15px' }}>
          <Col style={{ marginBottom: '5px' }}><Rate allowHalf value={imdbRating / 2} /></Col>
          <Col>
            <Tag>{Rated}</Tag>
            <Tag>{Runtime}</Tag>
            <Tag>{Genre}</Tag>
            <Tag>Year: {Year}</Tag>
          </Col>
        </Row>
        <Row>
          <Col style={{ marginBottom: '10px' }}>
            <Tag icon={<DollarCircleFilled />} color="#55acee">{BoxOffice}</Tag>
          </Col>
          <Col>{Ratings && Ratings.map(rating =>
            <Tag>{rating.Source} : {rating.Value} </Tag>
          )}
          </Col>
        </Row>
        <Row>
          <Col>{Plot}</Col>
          <Col><b>Actors : </b>{Actors}</Col>
          <Col><b>Director : </b>{Director}</Col>
          <Col><b>Production : </b>{Production}</Col>
        </Row>
      </Col>
    </Row>
  )
}

const Loader = () => (
  <div style={{ margin: '20px 0', textAlign: 'center' }}>
    <Spin />
  </div>
)

function Movies(props) {
  const history = useHistory()
  const [data, setData] = useState(props.movies);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [q, setQuery] = useState('joker');
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(props.totalCount)
  const [activateModal, setActivateModal] = useState(false);
  const [detail, setShowDetail] = useState(false);
  const [detailRequest, setDetailRequest] = useState(false);

  const onPageChange = (e) => {
    setData(null)
    setLoading(true)
    getSearchedMovies(q, e)
      .then(res => {
        setData(res.Search)
        setPageCount(res.totalResults)
        setCurrentPage(e)
        setLoading(false)
      })
  }
  const onLogout = useCallback(() => {
    fakeAuth.signout(() => history.push('/'))

  }, [])

  const SearchBox = useCallback(({ searchHandler }) => {
    return (
      <Row>
        <Col span={12} offset={6}>
          <Search
            placeholder="enter movie, series, episode name"
            enterButton="Search"
            size="large"
            onSearch={value => onSearchMovie(value)}
            allowClear={true}
          />
        </Col>
      </Row>
    )
  }, [props.movies, props.totalCount])
  const onSearchMovie = useCallback((value) => {
    if (!value) {
      setError(null)
      setData(props.movies)
      setPageCount(props.totalCount)
      setCurrentPage(1)
    }
    else {
      setQuery(value)
      setLoading(true)
      setData(null)
      getSearchedMovies(value, 1)
        .then(response => {
          if (response.Response !== "False") {
            setLoading(false)
            setData(response.Search)
            setPageCount(response.totalResults)
            setCurrentPage(1)
          }
          else {
            setLoading(false)
            setData(null)
            setPageCount(0)
            setError(response.Error);
          }
        })
        .catch(err => {
          setError('Movies not found')
        })
    }
  }, [props.movies, props.totalCount])
  useEffect(() => {
    setData(props.movies)
    setPageCount(props.totalCount)
  }, [props.movies, props.totalCount]);

  return (
    <div className="Movies">
      <Layout className="layout">
        <Header>
          <div style={{ textAlign: 'center' }}>
            <TextTitle style={{ color: '#ffffff', marginTop: '14px' }} level={3}>Movies</TextTitle>
            <span style={{ float: 'right', marginTop: -57 }}>
              <Button
                type="primary"
                icon="poweroff"
                onClick={onLogout}
              >
                log out
              </Button>
            </span>
          </div>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <SearchBox searchHandler={setQuery} />
            <br />

            <Row gutter={16} type="flex" justify="center">
              {loading &&
                <Loader />
              }
              {error &&
                <div style={{ margin: '20px 0' }}>
                  <Alert message={error} type="error" />
                </div>
              }
              {data && data.length > 0 && data.map((result, index) => (
                <ColCardBox
                  ShowDetail={setShowDetail}
                  DetailRequest={setDetailRequest}
                  ActivateModal={setActivateModal}
                  key={index}
                  {...result}
                />
              ))}
            </Row>
          </div>
          <Modal
            title='Detail'
            centered
            visible={activateModal}
            onCancel={() => setActivateModal(false)}
            footer={null}
            width={800}
          >
            {detailRequest === false ?
              (<MovieDetail {...detail} />) :
              (<Loader />)
            }
          </Modal>
        </Content>
        <Footer style={{ textAlign: 'center' }}><Pagination defaultCurrent={1} current={currentPage} total={pageCount} onChange={onPageChange} /></Footer>
      </Layout>
    </div>
  );
}

export default Movies;
