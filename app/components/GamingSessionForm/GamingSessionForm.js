import React, { Component } from "react";
import {
  ActivityIndicator,
  LayoutAnimation,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import styles from "./styles";
import moment from "../../../node_modules/moment";
import Toggle from "../Toggle";
import Card from "../Card";
import Environment from "../../config/environment";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';


export default class GamingSessionForm extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      platformsList: ['xbox-one', 'ps4', 'pc', 'stadia'],
      platform: this.props.gamingSession ? this.props.gamingSession.platform : this.props.platform,
      gamesData: {},
      gamesList: '',
      activitiesList: null,
      selectedGame: null,
      gameId: 23,
      selectedActivity: this.props.gamingSession && { label: this.props.gamingSession.category, value: this.props.gamingSession.category },
      description: this.props.gamingSession && this.props.gamingSession.name ? this.props.gamingSession.name : "",
      lightLevel: this.props.gamingSession && this.props.gamingSession.light_level ? this.props.gamingSession.light_level : "",
      when: this.props.gamingSession ? (this.props.gamingSession.start_asap ? "asap" : "scheduled") : null,
      displayWhenHelp: false,
      startDate: this.props.gamingSession ? Date.parse(this.props.gamingSession.start_time) : new Date(),
      selectedGroup: null, // this.props.groupsNew && this.props.groupsNew[0],
      displayVisibilityHelp: false,
      publicVisible: this.props.gamingSessionVisibility.publicVisible,
      allianceVisible: this.props.gamingSessionVisibility.allianceVisible,
      groupVisible: this.props.gamingSessionVisibility.groupVisible,
      friendsVisible: this.props.gamingSessionVisibility.friendsVisible,
      privateVisible: this.props.gamingSessionVisibility.privateVisible,
      beginnersWelcome: this.props.gamingSession ? this.props.gamingSession.beginners_welcome : false,
      sherpaRequested: this.props.gamingSession ? this.props.gamingSession.sherpa_requested : false,
      headsetsRequired: this.props.gamingSession ? this.props.gamingSession.mic_required : true,
      discordInviteLink: this.props.gamingSession ? this.props.gamingSession.discord_invite_link : '',
      delayPosting: this.props.gamingSession ? this.props.gamingSession.delay_game_visibility : false,
      autoPublic: this.props.gamingSession ? this.props.gamingSession.make_auto_public : false,
      autoAlliance: this.props.gamingSession ? this.props.gamingSession.make_auto_alliance_visible : false,
      partySize: this.props.gamingSession ? this.props.gamingSession.party_size : "1",
      displayPartySizeHelp: false,
      displayPartySizeDecreaseWarning: false,
      displayPartySizeIncreaseWarning: false,
      displaySupporterMessage: false,
      teamSizes: [...Array(100).keys()].map(i => { return { label: i, value: i } }),
      teamSize: this.props.gamingSession ? { label: this.props.gamingSession.team_size, value: this.props.gamingSession.team_size } : null,
      step: 1,
      loading: true,
      gamingSession: this.props.gamingSession,
      displayDatePicker: false
    };


  }

  componentDidMount() {

    // Get all games
    this.fetchGames().then((response) => {
      var menuItems = response.map(({ id, name }) => ({ value: id, label: name }));

      // Get activities for selected game
      let selectedGame = this.state.gamingSession ? menuItems.find(x => x.value == this.state.gamingSession.game_id) : menuItems.find(x => x.value == this.state.gameId)

      // Get group if editing or default to user's first group if they have any
      let selectedGroup = this.props.gamingSession && this.props.gamingSession.group_id ? this.props.groupsNew.find(x => x.value == this.props.gamingSession.group_id) : this.props.groupsNew ? this.props.groupsNew[0] : null

      this.setState({ gamesData: response, gamesList: menuItems, selectedGame: selectedGame, }, () => this.setState({ activitiesList: this.fetchActivities(this.state.selectedGame), loading: false, selectedGroup }))
    })
  }

  updatePlatform = (platform) => {
    this.setState({ platform });
  };

  updatePartySize = (partySize) => {
    if (this.props.gamingSession && this.props.gamingSession.hasWaitlist && this.props.gamingSession.party_size != partySize && (partySize < this.state.partySize)) {
      this.setState({ partySize, displayPartySizeDecreaseWarning: true, displayPartySizeIncreaseWarning: false });
    } else if (this.props.gamingSession && this.props.isFull && this.props.gamingSession.party_size != partySize && (partySize > this.state.partySize)) {
      this.setState({ partySize, displayPartySizeIncreaseWarning: true, displayPartySizeDecreaseWarning: false });
    } else {
      this.setState({ partySize, displayPartySizeIncreaseWarning: false, displayPartySizeDecreaseWarning: false });
    }
  };

  updateWhen = (when) => {
    this.setState({ when });
  };

  setStartDate = (startDate) => {
    this.setState({ startDate });
  }

  toggleAutoPublic = () => {
    if (this.state.publicVisible) {
      this.setState({ autoPublicError: this.state.autoPublicError ? null : "This game is already publicly visible." })
    } else {
      this.setState({ autoPublic: !this.state.autoPublic })
    }
  }

  toggleAutoAlliance = () => {
    if (this.state.allianceVisible) {
      this.setState({ autoAllianceError: this.state.autoAllianceError ? null : "This game is already visible to your alliance." })
    } else {
      this.setState({ autoAlliance: !this.state.autoAlliance })
    }
  }

  switchActivities = gameId => {
    this.setState(
      {
        selectedActivity: null
      },
      () => {
        this.fetchActivities(gameId);
      }
    );
  };

  fetchGames = async () => {
    let token = await AsyncStorage.getItem("id_token")

    let response = await fetch(
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "/games",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      }
    )
    let responseJson = await response.json();

    return responseJson;
  }


  fetchActivities = (selected) => {
    let selectedGame = this.state.gamesData.find(x => x.id == selected.value)

    let activities = selectedGame.activities.sort().map((name) => ({ value: name, label: name }));

    return activities
  }

  handleChangeGame = async selected => {
    let activities = await this.fetchActivities({ value: selected })

    // We only need this to update the game name shown in the toggle for game picker
    let selectedGame = this.state.gamesData.find(x => x.id == selected)

    this.setState(
      { selectedGame: { label: selectedGame.name, value: selectedGame.id }, gameId: selected, activitiesList: activities, selectedActivity: null, loading: true },
      () => this.setState(
        { loading: false })
    );
  };

  handleChangeActivity = selected => {
    this.setState(
      { selectedActivity: { label: selected, value: selected } })

  };

  handleChangeGroup = selected => {
    let selectedGroup = this.props.groupsNew.find(x => x.value == selected)
    this.setState(
      { selectedGroup, displayGroupPicker: false })
  };

  handleChangeTeamSize = teamSize => {
    this.setState(
      { teamSize })
  };


  toggleGames() {
    this.setState({
      viewGames: !this.state.viewGames
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  toggleActivities() {
    this.setState({
      viewActivities: !this.state.viewActivities
    });
  }

  togglePartySize() {
    this.setState({
      viewPartySize: !this.state.viewPartySize
    });
  }

  toggleAdvancedOptions() {

    this.setState({
      displayAdvancedOptions: !this.state.displayAdvancedOptions
    });

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  handleOnClick = (event, date) => {
    this.setState({ loading: true, displayDatePicker: false, displayDatePickerTime: false }, 
      () => this.setState({ loading: false })
      )
    
    if (date) {
      this.setStartDate(date)
      this.updateWhen("scheduled")
    }
    
    }
    

  formReady = () => {

    const { selectedGame, selectedActivity, when, publicVisible, allianceVisible, groupVisible, friendsVisible, privateVisible, teamSize } = this.state;

    let who = publicVisible || allianceVisible || groupVisible || friendsVisible || privateVisible

    let teamSizeSelected = selectedActivity && selectedActivity.value != "Other" || selectedActivity && selectedActivity.value == "Other" && teamSize

    return selectedGame && selectedActivity && selectedActivity.value && who && teamSizeSelected ? true : false
  }

  onSubmit = () => {
    const { selectedGame, platform, description, lightLevel, selectedActivity, startDate, when, selectedGroup, beginnersWelcome, sherpaRequested, headsetsRequired, partySize, teamSize, discordInviteLink, publicVisible, allianceVisible, groupVisible, friendsVisible, privateVisible, delayPosting, autoPublic, autoAlliance } = this.state

    if (!this.formReady()) {
      return this.setState({ formReadyError: "Make sure you've picked an activity and start time." })

    }

    this.setState({ loading: true });


    //  Rails DB field names for description and activity need to be updated, currently 'name' and 'category'
    let data = {
      gaming_session_id: this.props.gamingSession && this.props.gamingSession.id,
      game_id: selectedGame.value,
      platform: platform,
      name: description,
      category: selectedActivity.value,
      light_level: lightLevel,
      // startDate is integer in datepicker when editing an existing gaming session
      start_time: Number.isInteger(startDate) ? this.props.gamingSession.start_time : startDate,
      start_asap: when == "asap" ? true : false,
      group_id: groupVisible && selectedGroup ? selectedGroup.value : null,
      beginners_welcome: beginnersWelcome,
      sherpa_requested: sherpaRequested,
      mic_required: headsetsRequired,
      discord_invite_link: discordInviteLink,
      party_size: partySize,
      team_size: teamSize ? teamSize.value : null,
      created_from: "mobile-app",
      public_visible: publicVisible,
      alliance_visible: allianceVisible,
      group_visible: groupVisible,
      friends_visible: friendsVisible,
      private_visible: privateVisible,
      delay_game_visibility: delayPosting,
      make_auto_public: autoPublic,
      make_auto_alliance_visible: autoAlliance
    }


    this.props.handlePress(data)
  }


  render() {
    const whenHelpMessage = "Click SCHEDULED to schedule a game in the future (recommended). Or click ASAP to post a game right away, and keep it displayed until it fills."

    const visibilityHelpMessage = "PUBLIC: visible everywhere and notifies group and friends (recommended). ALLIANCE: visible on all allied group pages. GROUP: visible on group page. FRIENDS: visible to friends. PRIVATE: No notifications and not listed anywhere, only those with direct link can view."

    const partySizeHelpMessage = "Select how many players you already have. If it's just you, leave this at 1."

    const otherOptionsHelpMesssage = "BEGINNERS WELCOME: Makes game public and encourages new players to join. Also earns you Sherpa Points. SHERPA REQUESTED: Select this to request help from experienced players (sherpas) for this game."

    const { selectedGame, selectedActivity, startDate, selectedGroup, gamesList, activitiesList, gameId, displayDatePicker, displayDatePickerTime, displayGroupPicker, displayAdvancedOptions, formReadyError } = this.state;


    if (

      this.state.loading) {
      return (
        <View style={styles.outerContainer}>
          <View style={styles.container}>
            <ActivityIndicator />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.outerContainer}>

       

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Card>
            <View style={styles.container}>

              <Toggle
                title={selectedGame.label}
                toggle={() => this.toggleGames()}
              />

              {this.state.viewGames && (
                <View className="form-group text-dark">
                  <Picker key="game" style={styles.pickerStyle}
                    selectedValue={gameId}
                    onValueChange={this.handleChangeGame} >
                    {gamesList.map(game => (
                      <Picker.Item
                        key={game.value}
                        label={game.label}
                        value={game.value}
                      />
                    ))}
                  </Picker>
                </View>
              )}

{Platform.OS === "ios" ? (

              <View className="form-group">
                <Text>Activity</Text>
                <TouchableOpacity onPress={() => this.toggleActivities()} >
                  <View
                    style={styles.inputSelect}
                  >
                    <Text>{selectedActivity ? selectedActivity.label : "..."}</Text>
                  </View>
                </TouchableOpacity>

                {this.state.viewActivities && (
                  <View className="form-group text-dark">
                    <Picker key="activity" style={styles.pickerStyle}
                      selectedValue={selectedActivity ? selectedActivity.value : null}
                      onValueChange={this.handleChangeActivity} >
                      {activitiesList.map(activity => (
                        <Picker.Item
                          key={activity.value}
                          label={activity.label}
                          value={activity.value}
                        />
                      ))}
                    </Picker>
                  </View>
                )}
              </View>
) : (
  <View className="form-group">
  <Text>Activity:</Text>
  
    <View className="form-group text-dark">
      <Picker key="activity" style={styles.pickerStyle}
        selectedValue={selectedActivity ? selectedActivity.value : null}
        onValueChange={this.handleChangeActivity} >
           <Picker.Item
            key={"Select Activity..."}
            label={"Select Activity..."}
            value={null}
          />
        {activitiesList.map(activity => (
          <Picker.Item
            key={activity.value}
            label={activity.label}
            value={activity.value}
          />
        ))}
      </Picker>
    </View>
  
</View>
)}
              <View className="form-group">
                <Text>Description (optional) </Text>
                <View
                  style={styles.input}
                >
                  <TextInput style={{
                    fontSize: 14,
                    flex: 1
                  }}
                     value={this.state.description} 
                     onChangeText={value => this.setState({ description: value })} 
                     maxLength={255} />
                </View>

                {this.state.description.length >= 255 && (
                  <Text style={style.errorMessage}>
                    Max length is 255 characters.
                  </Text>
                )}
              </View>

              {Platform.OS === "ios" ? (
                <View className="form-group">
                <Text>Start Time </Text>
                <TouchableOpacity onPress={() => this.setState({ displayDatePicker: !this.state.displayDatePicker })} >
                  <View
                    style={styles.inputSelect}
                  >
                    <Text>{startDate ? moment(startDate).format("hh:mm A  MM/DD/YY") : "Select Start Time"}</Text>
                  </View>
                </TouchableOpacity>

                {displayDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={startDate}
                    mode={"datetime"}
                    is24Hour={true}
                    display="default"
                    onChange={this.handleOnClick}
                  />
                )}
              </View>

              ) : (
                <View className="form-group">
                  <Text>Start Date </Text>
                <TouchableOpacity onPress={() => this.setState({ displayDatePicker: !this.state.displayDatePicker })} >
                  <View
                    style={styles.inputSelect}
                  >
                    <Text>{startDate ? moment(startDate).format("MM/DD/YY") : "Select Start Time"}</Text>
                  </View>
                </TouchableOpacity>

                {displayDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={startDate}
                    mode={"date"}
                    is24Hour={true}
                    display="default"
                    onChange={this.handleOnClick}
                  />
                )}

              <Text>Start Time </Text>
                <TouchableOpacity onPress={() => this.setState({ displayDatePickerTime: !this.state.displayDatePickerTime })} >
                  <View
                    style={styles.inputSelect}
                  >
                    <Text>{startDate ? moment(startDate).format("hh:mm A") : "Select Start Time"}</Text>
                  </View>
                </TouchableOpacity>

                {displayDatePickerTime && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={startDate}
                    mode={"time"}
                    is24Hour={true}
                    display="default"
                    onChange={this.handleOnClick}
                  />
                )}
                
              </View>
              )}

              


              {this.state.groupVisible && (
                <View className="form-group text-dark">
                  <Text>Group</Text>
                  <TouchableOpacity onPress={() => this.setState({ displayGroupPicker: !displayGroupPicker })} >
                    <View
                      style={styles.inputSelect}
                    >
                      <Text>{selectedGroup ? selectedGroup.label : "Select Group"}</Text>

                    </View>
                  </TouchableOpacity>


                  {displayGroupPicker && (
                    <Picker key="group" style={styles.pickerStyle}
                      selectedValue={selectedGroup.value}
                      onValueChange={this.handleChangeGroup} >
                      {this.props.groupsNew.map(group => (
                        <Picker.Item
                          key={group.value}
                          label={group.label}
                          value={group.value}
                        />
                      ))}
                    </Picker>
                  )}
                </View>
              )}

              <Toggle
                title="Advanced Options"
                toggle={() => this.toggleAdvancedOptions()}
              />


              {displayAdvancedOptions && (
              <View>
                <View>
                  <View style="formGroup">
                    <Text>Party Size</Text>
                    <View style={ styles.buttonToggleBar } >
                      {["1", "2", "3", "4", "5", "6"].map(partySize => (
                        <TouchableOpacity style={[styles.buttonToggle, this.state.partySize == partySize && { backgroundColor: colors.blue }]  } onPress={() => this.updatePartySize(partySize)} >

                          <Text style={this.state.partySize == partySize ? styles.buttonText : styles.buttonTextToggle }>{partySize}</Text>
                        </TouchableOpacity>
                      )
                      )
                      }

                      <TouchableOpacity style={styles.buttonToggle} onPress={() => this.setState({ displayPartySizeHelp: !this.state.displayPartySizeHelp })}
                      >
                        <Text style={styles.buttonTextToggle}>?</Text> 
                      </TouchableOpacity>
                    </View>

                    <View style={{marginTop: 10, marginBottom: 15}}>
                    {this.state.displayPartySizeDecreaseWarning && (<Text>WARNING: this game has players on waitlist! If you lower the party size, they'll be automatically promoted to an active player and notified.</Text>)}

                    {this.state.displayPartySizeIncreaseWarning && (<Text>WARNING: this game is already full! If you increase the party size, you'll have to kick one of the players who've already joined.</Text>)}

                    {this.state.displayPartySizeHelp && (<Text>{partySizeHelpMessage}</Text>)}
                    </View>
                  </View>


                  <View style={{marginBottom: 15}}>
                    <Text>Platform</Text>
                    <View style={ styles.buttonToggleBar } >
                      {this.state.platformsList.map(platform => (
                        <TouchableOpacity style={[styles.buttonToggle, this.state.platform == platform && { backgroundColor: colors.blue }]  } onPress={() => this.updatePlatform(platform)} >

                          <Text style={this.state.platform == platform ? styles.buttonText : styles.buttonTextToggle }> {platform}</Text>
                        </TouchableOpacity>
                      )
                      )
                      }

                      
                    </View>
                  </View>

                  <View style={{marginTop: 10, marginBottom: 15}}>
                    <Text>Required Power Level</Text>
                    <View
                      style={styles.input}
                    >
                      <TextInput style={{
                        fontSize: 14,
                        flex: 1
                      }} 
                      keyboardType={"number-pad"}
                        value={this.state.lightLevel} onChangeText={value => this.setState({ lightLevel: value })} maxLength={4} />
                    </View>

                    {this.state.description.length >= 4 && (
                      <Text style={style.errorMessage}>
                        Max length is 4 characters.
                      </Text>
                    )}
                  </View>

                  <View style={{marginTop: 10, marginBottom: 15}}>
                    <Text>Other Options</Text>
                    <View style={ styles.buttonToggleBar } >


                    <TouchableOpacity style={[styles.buttonToggle, this.state.beginnersWelcome && { backgroundColor: colors.blue }]  } onPress={() => this.setState({ beginnersWelcome: !this.state.beginnersWelcome }) } >
                      <Text style={this.state.beginnersWelcome ? styles.buttonText : styles.buttonTextToggle }>Beginners Welcome</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.buttonToggle, this.state.sherpaRequested && { backgroundColor: colors.blue }]  } onPress={() => this.setState({ sherpaRequested: !this.state.sherpaRequested }) } >
                      <Text style={this.state.sherpaRequested ? styles.buttonText : styles.buttonTextToggle }>Sherpa Requested</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.buttonToggle, this.state.headsetsRequired && { backgroundColor: colors.blue }]  } onPress={() => this.setState({ headsetsRequired: !this.state.headsetsRequired }) } >
                      <Text style={this.state.headsetsRequired ? styles.buttonText : styles.buttonTextToggle }>Headsets Required</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.buttonToggle, this.state.displayOtherOptionsHelp && { backgroundColor: colors.blue }]  } onPress={() => this.setState({ displayOtherOptionsHelp: !this.state.displayOtherOptionsHelp }) } >
                      <Text style={this.state.displayOtherOptionsHelp ? styles.buttonText : styles.buttonTextToggle }>?</Text>
                    </TouchableOpacity>


                    {this.state.displayOtherOptionsHelp && (<Text style={styles.helpMessage}>{otherOptionsHelpMesssage}</Text>)}
                  </View>

                  </View>



                  </View>

                  {this.props.user.has_supporter_perks && (
                  <View style={{marginTop: 10, marginBottom: 15}}>

                    <Text>Supporter Options</Text>

                    <View style={ styles.buttonToggleBar } >

                    {!this.state.publicVisible && (
                    <TouchableOpacity style={[styles.buttonToggleSupporter, this.state.autoPublic && { borderColor: colors.gold, backgroundColor: colors.gold }]  } onPress={() => this.toggleAutoPublic() } >
                      <Text style={this.state.autoPublic ? styles.buttonText : styles.buttonTextToggleSupporter }>Open To Public If Not Full 2 Hours Before Start</Text>
                    </TouchableOpacity>
                    )}
                    {this.state.autoPublicError && (<Text className="text-danger">{this.state.autoPublicError}</Text>)}

                    {this.state.groupVisible && (
                    <TouchableOpacity style={[styles.buttonToggleSupporter, this.state.autoAlliance && { backgroundColor: colors.gold }]  } onPress={() => this.toggleAutoAlliance() } >
                      <Text style={this.state.autoAlliance ? styles.buttonText : styles.buttonTextToggleSupporter }>Open To Alliance If Not Full 2 Hours Before Start</Text>
                    </TouchableOpacity>
                    )}
                  
                    {this.state.autoAllianceError && (<Text className="text-danger">{this.state.autoAllianceError}</Text>)}

                  
                    <TouchableOpacity style={[styles.buttonToggleSupporter, this.state.delayPosting && { backgroundColor: colors.gold }]  } onPress={() => this.setState({ delayPosting: !this.state.delayPosting })} >
                      <Text style={this.state.delayPosting ? styles.buttonText : styles.buttonTextToggleSupporter }>Delay Posting For 1 Hour (so you can add friends first)</Text>
                    </TouchableOpacity>
                              
                      </View>
                  </View>
                  )}
              </View>)}



              {this.formReady() ? (
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.onSubmit()}
                            underlayColor={colors.primaryBlue}
                          >
                            <Text style={styles.buttonText}>Submit</Text>
                          </TouchableOpacity>
                          ) : (
                          <View>
                            {formReadyError && (<Text style={styles.helpMessage}>{formReadyError}</Text>)}

                            <TouchableOpacity
                              style={[styles.button, styles.buttonDisabled]}
                              onPress={() => this.onSubmit()}
                              underlayColor={colors.primaryBlue}
                            >
                              <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>

                          </View>
                      )}


              

            </View>
          </Card>
        </ScrollView>
      </View >
    );
  }
}


