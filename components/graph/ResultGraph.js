import React, { Component } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { VictoryAxis, VictoryChart, VictoryGroup, VictoryArea, VictoryLabel } from "victory-native";

class ResultGraph extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const results = this.props.results;
    const communication_style = this.props.commStyle;
    const sorted_results = this.props.sortedResults;
    let communication_styles = [];
    let final_graph = [];

    // constants needed for creating the graph
    const CURVE_OUT = 0.7;
    const CURVE_IN = 0.3;

    var i;
    for (i = 0; i < sorted_results.length; i++) {
      if (i < (sorted_results.length / 2)) {
        // curve in
        communication_styles[sorted_results[i][0]] = [
          { x: 0, y: results[sorted_results[i][3]], y0: 0},
          { x: results[sorted_results[i][2]] * CURVE_IN, y: results[sorted_results[i][3]] * CURVE_IN},
          { x: results[sorted_results[i][2]], y: 0, y0: 0}
        ];
      } else {
        //curve out
        communication_styles[sorted_results[i][0]] = [
          { x: 0, y: results[sorted_results[i][3]], y0: 0},
          { x: results[sorted_results[i][2]] * CURVE_OUT, y: results[sorted_results[i][3]] * CURVE_OUT},
          { x: results[sorted_results[i][2]], y: 0, y0: 0}
        ];
      }
    }

    final_graph[0] = communication_styles['Supporter'];
    final_graph[1] = communication_styles['Promoter'];
    final_graph[2] = communication_styles['Controller'];
    final_graph[3] = communication_styles['Analyzer'];

    

    return (
      <View style={styles.container}>
      <VictoryChart maxDomain={{ x: 130, y: 130 }} minDomain={{ x: -130, y: -130 }} width={350} height={300}>
      <VictoryLabel
      text="INFORMEEL"
      x={175} y={40}
      textAnchor="middle"
      style={{
        fontWeight: 'bold',
        fontSize: 8
      }}
      />
      <VictoryLabel
      text="DOMINANT"
      x={50} y={140}
      textAnchor="middle"
      style={{
        fontWeight: 'bold',
        fontSize: 8
      }}
      />
      <VictoryLabel
      text="AFWACHTEND"
      x={295} y={140}
      textAnchor="middle"
      style={{
        fontWeight: 'bold',
        fontSize: 8
      }}
      />
      <VictoryLabel
      text="FORMEEL"
      x={175} y={260}
      textAnchor="middle"
      style={{
        fontWeight: 'bold',
        fontSize: 8
      }}
      />
      <VictoryLabel
      text="Promoter"
      x={90} y={80}
      textAnchor="middle"
      style = {{fill:'#ea6911',fontWeight:'600',fontSize:18}}
      />
      <VictoryLabel
      text="Controller"
      x={90} y={220}
      textAnchor="middle"
      style = {{fill:'#379b63',fontWeight:'600',fontSize:18}}
      />
      <VictoryLabel
      text="Supporter"
      x={260} y={80}
      textAnchor="middle"
      style = {{fill:'#f7b4f6',fontWeight:'600',fontSize:18}}
      />
      <VictoryLabel
      text="Analyzer"
      x={260} y={220}
      textAnchor="middle"
      style = {{fill:'#6dc0ec',fontWeight:'600',fontSize:18}}
      />
      <VictoryAxis crossAxis
      offsetY={150}
      domain={[-100, 100]}
      standalone={false}
      style={{
        tickLabels: {fontSize: 0, fill: 'white'}
      }}
      />
      <VictoryAxis dependentAxis crossAxis
      offsetX={175}
      domain={[-100, 100]}
      standalone={false}
      style={{
        tickLabels: {fontSize: 0, fill: 'white'}
      }}
      />
      <VictoryGroup>
      <VictoryArea // supporter
      style={{ data: { fill: "#f7b4f6", border: "#000000" }}}
      interpolation = "natural"
      data={final_graph[0]}
      />
      <VictoryArea // promoter
      style={{ data: { fill: "#ea6911" }}}
      interpolation = "natural"
      data={final_graph[1]}
      />
      <VictoryArea // controller
      style={{ data: { fill: "#379b63" }}}
      interpolation = "natural"
      data={final_graph[2]}
      />
      <VictoryArea // analyzer
      style={{ data: { fill: "#6dc0ec" }}}
      interpolation = "natural"
      data={final_graph[3]}
      />
      </VictoryGroup>
      </VictoryChart>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'white',
    width: '85%',
    height: '40%',
  }
});

export default ResultGraph;
