// Creates SDMS database schema for ArangoDB
'use strict'

var db = require("@arangodb").db;
var graph_module = require("@arangodb/general-graph");

// Collection Descriptions
//
//  "u"            User
//  "accn"         User facility accounts
//  "uuid"         User globus UUIDs
//  "p"            Project
//  "g"            Group
//  "d"            Data
//  "c"            Collection
//  "t"            Topic
//  "a"            Alias
//  "n"            Annotations (notes)
//  "q"            Saved queries
//  "repo"         Repository servers
//  "task"         Tasks
//  "tag"          Tags
//  "sch"          Schemas
//  "config"       Configuration
//  "metrics"      Metrics

const orphan_collections = ["metrics","config","tag"];

// Each line provides the edge collection name, the starting collection and 
// then the ending collection.

const edge_definitions = [
  { collection: "owner",   "from": ["d","c","p","g","a","q","task"], "to": ["u","p"]},
  { collection: "member",  "from": ["g"],         "to": ["u"]},
  { collection: "item",    "from": ["c"],         "to": ["d","c"]},
  { collection: "acl",     "from": ["d","c"],     "to": ["u","g"]},
  { collection: "top",     "from": ["c","t"],     "to": ["t"]},
  { collection: "ident",   "from": ["u"],         "to": ["accn","uuid"]},
  { collection: "admin",   "from": ["p","repo"],  "to": ["u"]},
  { collection: "note",    "from": ["d","c","n"], "to": ["n"]},
  { collection: "alias",   "from": ["d","c"],     "to": ["a"]},
  { collection: "alloc",   "from": ["u","p"],     "to": ["repo"]},
  { collection: "loc",     "from": ["d"],         "to": ["repo"]},
  { collection: "dep",     "from": ["d"],         "to": ["d"]},
  { collection: "lock",    "from": ["task"],      "to": ["d","c","p","u","repo"]},
  { collection: "block",   "from": ["task"],      "to": ["task"]},
  { collection: "sch_dep", "from": ["sch"],       "to": ["sch"]}
];

graph_module._create("sdmsg", edge_definitions, orphan_collections);

var userview = db._createView("userview","arangosearch",{});
var analyzers = require("@arangodb/analyzers");

// ---------- User name indexing (view) ----------

var user_name = analyzers.save("user_name","ngram",{
  "min": 3,
  "max": 5,
  "streamType":"utf8",
  "preserveOriginal":true
}, ["frequency","norm","position"]);

userview.properties({
  links:{
    "u":{
      fields:{"name":{analyzers:["user_name"]}},
      includeAllFields: false
    }
  }
},true);

// ---------- Tag name indexing (view) ----------

var tag_name = analyzers.save("tag_name","ngram",{
  "min": 3,
  "max": 5,
  "streamType":"utf8",
  "preserveOriginal":true
}, ["frequency","norm","position"]);

var tagview = db._createView("tagview","arangosearch",{});

tagview.properties({
  links:{
    "tag":{
      fields:{"_key":{analyzers:["tag_name"]}},
      includeAllFields: false
    }
  }
},true);

// ---------- Schema indexing (view) ----------

var sch_id = analyzers.save("sch_id","ngram",{
  "min": 3,
  "max": 5,
  "streamType":"utf8",
  "preserveOriginal":true
}, ["frequency","norm","position"]);

var schemaview = db._createView("schemaview","arangosearch",{});

schemaview.properties({
  links:{
    "sch":{
      fields:{
        "pub":{ analyzers: ["identity"] },
        "id": { analyzers: ["sch_id","identity"] },
        "desc": { analyzers: ["text_en"] },
        "own_id": { analyzers: ["identity"] },
        "own_nm": { analyzers: ["user_name","identity"] }
      },
      includeAllFields: false
    }
  }
},true);

// ---------- Data indexing (view) ----------

var view = db._createView("dataview","arangosearch",{});

view.properties({
    links: {
      "d": {
        fields:{
          "public": { analyzers: ["identity"] },
          "cat_tags": { analyzers: ["identity"] },
          "tags": { analyzers: ["identity"] },
          "title": { analyzers: ["text_en"] },
          "desc": { analyzers: ["text_en"] },
          "sch_id": { analyzers: ["identity"] },
          "md_err": { analyzers: ["identity"] },
          "owner": { analyzers: ["identity"] },
          "creator": { analyzers: ["identity"] },
          "ut": { analyzers: ["identity"] },
          "alias": { analyzers: ["identity"] },
          "_id": { analyzers: ["identity"] }
        },
        includeAllFields: false
      }
    },
    primarySort:[
      {field:"title",direction:"asc"}
    ]
  },
  true
);

// ---------- Collection indexing (view) ----------

view = db._createView("collview","arangosearch",{});

view.properties({
    links: {
      "c": {
        fields: {
          "public": { analyzers: ["identity"] },
          "cat_tags": { analyzers: ["identity"] },
          "tags": { analyzers: ["identity"] },
          "title": { analyzers: ["text_en"] },
          "desc": { analyzers: ["text_en"] },
          "owner": { analyzers: ["identity"] },
          "creator": { analyzers: ["identity"] },
          "ut": { analyzers: ["identity"] },
          "alias": { analyzers: ["identity"] },
          "_id": { analyzers: ["identity"] }
        },
        includeAllFields: false
      }
    },
    primarySort:[
      {field:"title",direction:"asc"}
    ]
  },
  true
);

// ---------- Project indexing (view) ----------

view = db._createView("projview","arangosearch",{});

view.properties({
    links: {
      "p": {
        fields: { "title":{analyzers:["text_en"]},"desc":{analyzers:["text_en"]}},
        includeAllFields: false
      }
    }
  },
  true
);

view = db._createView("topicview","arangosearch",{});

view.properties({
    links: {
      "t": {
        fields: {"title":{analyzers:["text_en"]}},
        includeAllFields: false
      }
    }
  },
  true
);

// ---------- Individual field indexing ----------

/*db.d.ensureIndex({ type: "fulltext", unique: false, fields: [ "keyw" ], sparse: true, minLength: 3 });
db.c.ensureIndex({ type: "fulltext", unique: false, fields: [ "topic" ], sparse: true, minLength: 3 });*/

db.task.ensureIndex({ type: "hash", unique: false, fields: [ "client" ], sparse: true });
db.task.ensureIndex({ type: "skiplist", unique: false, fields: [ "status" ], sparse: true });
db.task.ensureIndex({ type: "hash", unique: false, fields: [ "servers[*]" ], sparse: true });

/*db.d.ensureIndex({ type: "hash", unique: false, fields: [ "public" ], sparse: true });*/
db.d.ensureIndex({ type: "hash", unique: false, fields: [ "doi" ], sparse: true });
db.d.ensureIndex({ type: "persistent", unique: false, fields: [ "tags[*]" ] });

db.c.ensureIndex({ type: "persistent", unique: false, fields: [ "public" ], sparse: true });
db.c.ensureIndex({ type: "persistent", unique: false, fields: [ "tags[*]" ] });

db.u.ensureIndex({ type: "hash", unique: true, fields: [ "pub_key" ], sparse: true });
db.u.ensureIndex({ type: "hash", unique: true, fields: [ "access" ], sparse: true });
db.g.ensureIndex({ type: "hash", unique: true, fields: [ "uid", "gid" ] });
db.loc.ensureIndex({ type: "hash", unique: false, fields: [ "uid" ], sparse: true });
db.dep.ensureIndex({ type: "hash", unique: false, fields: [ "type" ], sparse: true });

db.tag.ensureIndex({ type: "persistent", unique: false, fields: [ "count" ], sparse: true });

db.t.ensureIndex({ type: "persistent", unique: false, fields: [ "top" ], sparse: true });

//db.sch.ensureIndex({ type: "hash", unique: true, fields: [ "id" ], sparse: false });
db.sch.ensureIndex({ type: "hash", unique: true, fields: [ "id", "ver" ], sparse: false });

db.metrics.ensureIndex({ type: "persistent", unique: false, fields: [ "timestamp", "type", "uid" ], sparse: true });


