import * as React from "react";
import {
  Text,
  Image,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SearchBar } from "react-native-elements";
import axios from "axios";

export const CLIENT_ID = "652b64e9aa10780";

export default class SearchingBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      search: "",
    };
    this.arrayHolder = [];
  }

  componentDidMount() {
    axios
      .get(
        "https://api.imgur.com/3/gallery/t/cat/%7Bsort%7D/%7Bwindow%7D/%7Bpage%7D",
        {
          headers: {
            Authorization: `Client-ID ${CLIENT_ID}`,
          },
        }
      )
      .then((response) => {
        this.setState(
          {
            isLoading: false,
            dataSource: [response.data],
          },
          () => {
            this.arrayHolder = response.data;
          }
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }

  SearchFilterFunction(text) {
    const newData = this.arrayHolder.filter((item) => {
      const itemData = item.data.items.title // ============================ UPDATE : map ?
        ? item.data.items.title.toUpperCase()
        : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      dataSource: newData,
      search: text,
    });
  }

  ListViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 0,
          width: "90%",
          backgroundColor: "#080808",
        }}
      />
    );
  };

  getLinks = (item) => {
    const pattern = /\.[0-9a-z]+$/i;
    const links = item.data.items.slice(0, 30).map((event) => {
      if (event.images !== undefined) {
        return event.images.map((e) => {
          if (e.link.match(pattern)[0] !== ".mp4") {
            return e.link;
          }
        });
      }
    });
    return this.flatArray(links);
  };

  flatArray = (arr) => {
    const result = [];

    arr.forEach((i) => {
      if (i !== undefined) {
        i.forEach((y) => {
          result.push(y);
        });
      }
    });
    return result;
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.viewStyle}>
        <SearchBar
          round
          searchIcon={{ size: 24 }}
          onChangeText={(text) => this.SearchFilterFunction(text)}
          onClear={(text) => this.SearchFilterFunction("")}
          placeholder="Search"
          value={this.state.search}
        />
        <FlatList
          data={this.state.dataSource}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          renderItem={({ item }) => {
            const links = this.getLinks(item);
            return links.map((event) => {
              if (event !== undefined) {
                return (
                  <Image style={styles.tinyLogo} source={{ uri: event }} />
                );
              }
            });
          }}
          enableEmptySections={true}
          style={{ marginTop: 10 }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    marginTop: 100,
    marginTop: Platform.OS == "ios" ? 40 : 0,
  },
  tinyLogo: {
    flex: 1,
    justifyContent: "space-around",
    width: 100,
    height: 100,
    // width: "95%",
    // height: 300,
    margin: 10,
    marginRight: 30,
    marginBottom: 60,
  },
  textStyle: {
    padding: 20,
  },
});