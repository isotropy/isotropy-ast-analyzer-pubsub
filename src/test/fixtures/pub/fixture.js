import pubsub from "./my-streams";

pubsub.pub("@leo.channel", { data: "hello" });

sub("@leo.channel", (channel, msg) => {
  console.log(msg);
});






