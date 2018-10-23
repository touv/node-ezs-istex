const assert = require('assert');
const from = require('from');
const fs = require('fs');
const path = require('path');
const ezs = require('ezs');

const token = process.env.ISTEX_TOKEN;
ezs.use(require('../lib'));
ezs.use(require('ezs-basics'));

if (token) {
    console.warn('Using ISTEX_TOKEN', token);
}
describe('test', () => {
    it('ISTEXSave #0', (done) => {
        const result = [];
        from([
            {
                id: '87699D0C20258C18259DED2A5E63B9A50F3B3363',
            },
            {
                id: 'ark:/67375/QHD-T00H6VNF-0',
            },

        ])
            .pipe(ezs('ISTEXFetch', {
                source: 'id',
                sid: 'test',
                token,
            }))
            .pipe(ezs('ISTEXSave', {
                sid: 'test',
                token,
            }))
            .pipe(ezs.catch(() => done()))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 2);
                assert(result[0].includes('QHD-T00H6VNF-0'));
                done();
            });
    }).timeout(5000);

    it('ISTEXParseDotCorpus #0', (done) => {
        const result = [];
        const corpus = fs.readFileSync(path.resolve(__dirname, './1notice.corpus'));
        from([
            corpus.toString(),
        ])
            .pipe(ezs('ISTEXParseDotCorpus'))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 1);
                assert(result[0]);
                assert.equal(result[0].publisher, 'CNRS');
                assert.equal(result[0].id, '2FF3F5B1477986B9C617BB75CA3333DBEE99EB05');
                done();
            });
    }).timeout(5000);

    it('ISTEXParseDotCorpus #1', (done) => {
        const result = [];
        const corpus = fs.readFileSync(path.resolve(__dirname, './1query.corpus'));
        from([
            corpus.toString(),
        ])
            .pipe(ezs('ISTEXParseDotCorpus'))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert(result.length > 0);
                assert(result[0]);
                assert.equal(result[0].publisher, 'CNRS');
                done();
            });
    }).timeout(5000);

    it('ISTEX #0', (done) => {
        const result = [];
        from([1, 2])
            .pipe(ezs('ISTEX', {
                query: 'this is an test',
                size: 3,
                maxPage: 1,
                sid: 'test',
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 6);
                assert(result[0]);
                assert.equal(result[0].id, result[3].id);
                done();
            });
    }).timeout(5000);

    it('ISTEX #1', (done) => {
        const result = [];
        from([1, 2])
            .pipe(ezs('ISTEX', {
                id: '87699D0C20258C18259DED2A5E63B9A50F3B3363',
                size: 3,
                maxPage: 1,
                sid: 'test',
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 2);
                assert(result[0]);
                assert.equal(result[0].id, result[1].id);
                done();
            });
    }).timeout(5000);

    it('ISTEX #2', (done) => {
        const result = [];
        from([1, 2])
            .pipe(ezs('ISTEX', {
                query: 'this is an test',
                id: '87699D0C20258C18259DED2A5E63B9A50F3B3363',
                size: 3,
                maxPage: 1,
                sid: 'test',
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 8);
                assert(result[0]);
                assert.equal(result[0].id, result[4].id);
                done();
            });
    }).timeout(6000);

    it('ISTEXFetch #0', (done) => {
        const result = [];
        from([
            {
                id: '87699D0C20258C18259DED2A5E63B9A50F3B3363',
            },
            {
                id: 'ark:/67375/QHD-T00H6VNF-0',
            },

        ])
            .pipe(ezs('ISTEXFetch', {
                source: 'id',
                sid: 'test',
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 2);
                assert(result[0]);
                assert.equal(result[0].id, '87699D0C20258C18259DED2A5E63B9A50F3B3363');
                assert.equal(result[1].ark[0], 'ark:/67375/QHD-T00H6VNF-0');
                done();
            });
    }).timeout(5000);

    it('ISTEXFetch #1', (done) => {
        const result = [];
        from([
            {
                id: '87699D0C20258C18259DED2A5E63B9A50F3B3363',
            },
            {
                id: 'ark:/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            },

        ])
            .pipe(ezs('ISTEXFetch', {
                source: 'id',
                sid: 'test',
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 2);
                assert(result[0]);
                assert.equal(result[0].id, '87699D0C20258C18259DED2A5E63B9A50F3B3363');
                assert(result[1] instanceof Error);
                done();
            });
    }).timeout(5000);

    it('ISTEXSearch #0', (done) => {
        const result = [];
        from([
            {
                _id: 1,
            },
        ])
            .pipe(ezs('ISTEXSearch', {
                query: 'this is an test',
                maxPage: 3,
                target: 'value',
                sid: 'test',
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 3);
                assert(result[0]);
                assert(typeof result[0].value === 'object');
                assert(typeof result[1].value === 'string');
                done();
            });
    }).timeout(5000);

    it('ISTEXSearch #1', (done) => {
        const result = [];
        from([
            'this is an test',
        ])
            .pipe(ezs('ISTEXSearch', {
                maxPage: 3,
                sid: 'test',
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 3);
                assert(result[0]);
                assert(typeof result[0] === 'object');
                assert(typeof result[1] === 'string');
                done();
            });
    }).timeout(5000);

    it('ISTEXSearch #2', (done) => {
        const result = [];
        from([
            {
                q: 'this is an test',
            },
        ])
            .pipe(ezs('ISTEXSearch', {
                source: 'q',
                maxPage: 3,
                sid: 'test',
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 3);
                assert(result[0]);
                assert(typeof result[0] === 'object');
                assert(typeof result[1] === 'string');
                done();
            });
    }).timeout(5000);

    it('ISTEXSearch #3', (done) => {
        const result = [];
        from([
            'this is an test',
        ])
            .pipe(ezs('ISTEXSearch', {
                target: 'istex',
                maxPage: 3,
                sid: 'test',
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 3);
                assert(result[0]);
                assert(typeof result[0].istex === 'object');
                assert(typeof result[1].istex === 'string');
                done();
            });
    }).timeout(5000);

    it('ISTEXScroll #1', (done) => {
        const result = [];
        from([
            'this is an test',
        ])
            .pipe(ezs('ISTEXSearch', {
                maxPage: 2,
                sid: 'test',
            }))
            .pipe(ezs('ISTEXScroll'))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 2);
                assert(typeof result[0] === 'object');
                assert(typeof result[1] === 'object');
                done();
            });
    }).timeout(5000);

    it('ISTEXScroll #2', (done) => {
        const result = [];
        from([
            'this is an test',
        ])
            .pipe(ezs('ISTEXSearch', {
                target: 'istex',
                maxPage: 2,
                sid: 'test',
            }))
            .pipe(ezs('ISTEXScroll', {
                source: 'istex',
                target: 'istex',
                sid: 'test',
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 2);
                assert(typeof result[0].istex === 'object');
                assert(typeof result[1].istex === 'object');
                done();
            });
    }).timeout(5000);

    it('ISTEXResult #1', (done) => {
        const result = [];
        from([
            'this is an test',
        ])
            .pipe(ezs('ISTEXSearch', {
                maxPage: 2,
                sid: 'test',
            }))
            .pipe(ezs('ISTEXScroll'))
            .pipe(ezs('ISTEXResult'))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 4000);
                assert.equal(result[0].id.length, 40);
                assert.equal(result[1000].id.length, 40);
                assert.equal(result[3500].id.length, 40);
                done();
            });
    }).timeout(5000);

    it('ISTEXResult #2', (done) => {
        const result = [];
        from([
            {
                mark: 'azerty',
                istex: 'this is an test',
            },
        ])
            .pipe(ezs('ISTEXSearch', {
                source: 'istex',
                target: 'istex',
                maxPage: 2,
                sid: 'test',
            }))
            .pipe(ezs('ISTEXScroll', {
                source: 'istex',
                target: 'istex',
                sid: 'test',
            }))
            .pipe(ezs('ISTEXResult', {
                source: 'istex',
                target: 'istex',
                sid: 'test',
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 4000);
                assert.equal(result[0].mark, 'azerty');
                assert.equal(result[0].istex.id.length, 40);
                assert.equal(result[1000].istex.id.length, 40);
                assert.equal(result[3500].istex.id.length, 40);
                done();
            });
    }).timeout(5000);

    it('ISTEXTriplify #1', (done) => {
        const result = [];
        from([
            {
                istex: 'ezs',
            },
        ])
            .pipe(ezs('ISTEXSearch', {
                source: 'istex',
                target: 'istex',
                maxPage: 1,
                sid: 'test',
            }))
            .pipe(ezs('ISTEXScroll', {
                source: 'istex',
                target: 'istex',
                sid: 'test',
            }))
            .pipe(ezs('ISTEXResult', {
                source: 'istex',
                target: 'istex',
                sid: 'test',
            }))
            .pipe(ezs('OBJFlatten'))
            .pipe(ezs('ISTEXTriplify', {
                source: 'istex/',
                property: [
                    'istex/arkIstex -> http://purl.org/dc/terms/identifier',
                ],
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert(result.length > 2);
                assert(result[0].length > 0);
                assert.equal(result[0].split(' ').length, 4);
                assert(result[1].endsWith('> <https://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .\n'));
                assert(result[2].includes(' <http://purl.org/dc/terms/identifier> '));
                done();
            });
    }).timeout(5000);

    it('ISTEXTriplify #2', (done) => {
        const result = [];
        from([
            {
                istex: 'ezs',
            },
        ])
            .pipe(ezs('ISTEXSearch', {
                source: 'istex',
                target: 'istex',
                maxPage: 1,
                sid: 'test',
                field: 'author',
            }))
            .pipe(ezs('ISTEXScroll', {
                source: 'istex',
                target: 'istex',
                sid: 'test',
            }))
            .pipe(ezs('ISTEXResult', {
                source: 'istex',
                target: 'istex',
                sid: 'test',
            }))
            .pipe(ezs('OBJFlatten', { safe: false }))
            .pipe(ezs('ISTEXTriplify', {
                source: 'istex/',
                property: [
                    'istex/author/\\d+/name -> http://purl.org/dc/terms/creator',
                ],
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert(result.length > 2);
                assert(result[0].length > 0);
                assert.equal(result[0].split(' ').length, 4);
                assert(result[1].endsWith('> <https://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .\n'));
                assert(result[2].includes(' <http://purl.org/dc/terms/creator> '));
                assert(!result[2].includes('undefined'));
                done();
            });
    }).timeout(5000);

    it('ISTEXTriplify #3', (done) => {
        const result = [];
        from([
            {
                istex: 'language.raw:rum',
            },
        ])
            .pipe(ezs('ISTEXSearch', {
                source: 'istex',
                target: 'istex',
                maxPage: 1,
                sid: 'test',
                field: 'fulltext',
            }))
            .pipe(ezs('ISTEXScroll', {
                source: 'istex',
                target: 'istex',
                sid: 'test',
            }))
            .pipe(ezs('ISTEXResult', {
                source: 'istex',
                target: 'istex',
                sid: 'test',
            }))
            .pipe(ezs('OBJFlatten', { safe: false }))
            .pipe(ezs('ISTEXTriplify', {
                source: 'istex/',
                property: [
                    'istex/fulltext/0/uri -> https://data.istex.fr/ontology/istex#accessURL',
                ],
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert(result.length > 2);
                assert(result[0].length > 0);
                assert.equal(result[0].split(' ').length, 4);
                assert(result[1].endsWith('> <https://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .\n'));
                assert(result[2].includes(' <https://data.istex.fr/ontology/istex#accessURL> '));
                assert(result[2].endsWith('> .\n'));
                assert(result[2].includes(' <https://api.istex.fr/document/'));
                assert(!result[2].includes('undefined'));
                done();
            });
    }).timeout(5000);

    it('ISTEXTriplify #4', (done) => {
        const result = [];
        from([
            {
                istex: 'language.raw:rum',
            },
        ])
            .pipe(ezs('ISTEXSearch', {
                source: 'istex',
                target: 'istex',
                maxPage: 1,
                sid: 'test',
                field: 'fulltext',
            }))
            .pipe(ezs('ISTEXScroll', {
                source: 'istex',
                target: 'istex',
                sid: 'test',
            }))
            .pipe(ezs('ISTEXResult', {
                source: 'istex',
                target: 'istex',
                sid: 'test',
            }))
            .pipe(ezs('OBJFlatten', { safe: false }))
            .pipe(ezs('ISTEXTriplify', {
                source: 'istex/',
                property: [
                    'istex/fulltext/0/uri -> https://data.istex.fr/ontology/istex#accessURL',
                ],
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert(result.length > 2);
                assert(result[0].length > 0);
                assert.equal(result[0].split(' ').length, 4);
                assert(result[0].startsWith('<https://api.istex.fr/ark:/'));
                assert(result[1].startsWith('<https://api.istex.fr/ark:/'));
                assert(result[2].startsWith('<https://api.istex.fr/ark:/'));
                assert(!result[2].includes('undefined'));
                done();
            });
    }).timeout(5000);

    it('ISTEXTriplify #5', (done) => {
        const result = [];
        from([
            {
                arkIstex: 'ark:/fake',
                id: '1',
                'author/3/affiliations/1': null,
                'author/3/affiliations/2': 'E-mail: ivan.couee@univ-rennes1.fr',
            },
        ])
            .pipe(ezs('ISTEXTriplify', {
                property: [
                    '^author/\\d+/affiliations -> https://data.istex.fr/ontology/istex#affiliation',
                ],
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(3, result.length);
                assert(!result[2].includes('undefined'));
                assert.equal('<https://api.istex.fr/ark:/fake> <https://data.istex.fr/ontology/istex#affiliation> "E-mail: ivan.couee@univ-rennes1.fr" .\n', result[2]);
                done();
            });
    }).timeout(5000);

    it('ISTEXTriplify #6', (done) => {
        const result = [];
        from([
            {
                arkIstex: 'ark:/fake',
                id: '1',
                'author/3/affiliations/2': 'E-mail: ivan.couee@univ-rennes1.fr',
            },
        ])
            .pipe(ezs('ISTEXTriplify', {
                property: [
                    '^author/\\d+/affiliations -> https://data.istex.fr/ontology/istex#affiliation',
                    '^author/\\d+/affiliations -> https://data.istex.fr/ontology/istex#fakeProperty',
                ],
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(4, result.length);
                assert(!result[2].includes('undefined'));
                assert.equal('<https://api.istex.fr/ark:/fake> <https://data.istex.fr/ontology/istex#affiliation> "E-mail: ivan.couee@univ-rennes1.fr" .\n', result[2]);
                assert.equal('<https://api.istex.fr/ark:/fake> <https://data.istex.fr/ontology/istex#fakeProperty> "E-mail: ivan.couee@univ-rennes1.fr" .\n', result[3]);
                done();
            });
    }).timeout(5000);

    it('ISTEXTriplify #7', (done) => {
        const result = [];
        from([
            {
                arkIstex: 'ark:/fake',
                id: '1',
                'author/3/affiliations/2': 'E-mail: ivan.couee@univ-rennes1.fr',
            },
        ])
            .pipe(ezs('ISTEXTriplify', {
                property: '^author/\\d+/affiliations -> https://data.istex.fr/ontology/istex#affiliation',
            }))
            .on('data', (chunk) => {
                result.push(chunk);
            })
            .on('end', () => {
                assert.equal(3, result.length);
                assert(!result[2].includes('undefined'));
                assert.equal('<https://api.istex.fr/ark:/fake> <https://data.istex.fr/ontology/istex#affiliation> "E-mail: ivan.couee@univ-rennes1.fr" .\n', result[2]);
                done();
            });
    }).timeout(5000);

    it('ISTEXRemoveIf #0', (done) => {
        let result = [];
        const corpus = fs.readFileSync(path.resolve(__dirname, './1notice.corpus'));
        from([
            corpus.toString(),
        ])
            .pipe(ezs('ISTEXParseDotCorpus'))
            .pipe(ezs('OBJFlatten', { safe: false }))
            .pipe(ezs('ISTEXTriplify', {
                property: [
                    '^host/genre -> host/genre',
                    '^host/title -> https://data.istex.fr/fake#journalTitle',
                    '^host/title -> https://data.istex.fr/fake#bookTitle',
                    '^host/title -> https://data.istex.fr/fake#seriesTitle',
                ],
            }))
            .pipe(ezs('ISTEXRemoveIf', {
                if: '<host/genre> = "journal"',
                remove: [
                    '<https://data.istex.fr/fake#bookTitle>',
                    '<https://data.istex.fr/fake#seriesTitle>',
                    '<host/genre>',
                ],
            }))
            .on('data', (chunk) => {
                result = result.concat(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 3);
                assert(!result[2].includes('<host/genre>'));
                assert(result[2].includes('journalTitle'));
                done();
            });
    }).timeout(5000);

    it('ISTEXRemoveIf #1', (done) => {
        let result = [];
        from([
            '<https://api.istex.fr/ark:/67375/HXZ-PTF2CVH1-4> <https://data.istex.fr/fake#seriesTitle> "Annals of Botany" .\n',
            '<https://api.istex.fr/ark:/67375/HXZ-PTF2CVH1-4> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/17C9717E24A6A14A99CB0FD3CC8455FEA0B3973E/fulltext/pdf> .\n',
        ])
            .pipe(ezs('ISTEXRemoveIf', {
                if: '<host/genre> = "journal"',
                remove: [
                    '<https://data.istex.fr/fake#bookTitle>',
                    '<https://data.istex.fr/fake#seriesTitle>',
                    '<host/genre>',
                ],
            }))
            .on('data', (chunk) => {
                result = result.concat(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 2);
                assert(result[0].endsWith('Botany" .\n'));
                assert(result[1].endsWith('3E/fulltext/pdf> .\n'));
                done();
            });
    }).timeout(5000);

    it('ISTEXRemoveIf #2', (done) => {
        let result = [];
        from([
            '<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <https://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .\n',
            '<https://api.istex.fr/ark:/67375/HXZ-PTF2CVH1-4> <https://data.istex.fr/fake#seriesTitle> "Annals of Botany" .\n',
            '<https://api.istex.fr/ark:/67375/HXZ-PTF2CVH1-4> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/17C9717E24A6A14A99CB0FD3CC8455FEA0B3973E/fulltext/pdf> .\n',
        ])
            .pipe(ezs('ISTEXRemoveIf', {
                if: '<host/genre> = "journal"',
                remove: [
                    '<https://data.istex.fr/fake#bookTitle>',
                    '<https://data.istex.fr/fake#seriesTitle>',
                    '<host/genre>',
                ],
            }))
            // .pipe(ezs('debug'))
            .on('data', (chunk) => {
                result = result.concat(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 3);
                assert(result[0].endsWith('/Document> .\n'));
                done();
            });
    }).timeout(5000);

    it('ISTEXRemoveIf #3', (done) => {
        let result = [];
        from([
            '<https://api.istex.fr/ark:/67375/P0J-GTV59GTP-D> <host/genre> "book-series" .\n',
            '<https://api.istex.fr/ark:/67375/P0J-GTV59GTP-D> <https://data.istex.fr/fake#journalTitle> "Photochemistry: Volume 1" .\n',
            '<https://api.istex.fr/ark:/67375/P0J-GTV59GTP-D> <https://data.istex.fr/fake#bookTitle> "Photochemistry: Volume 1" .\n',
            '<https://api.istex.fr/ark:/67375/P0J-GTV59GTP-D> <https://data.istex.fr/fake#seriesTitle> "Photochemistry: Volume 1" .\n',
            '<https://api.istex.fr/ark:/67375/P0J-GTV59GTP-D> <https://data.istex.fr/fake#databaseTitle> "Photochemistry: Volume 1" .\n',
            '<https://api.istex.fr/ark:/67375/P0J-GTV59GTP-D> <https://data.istex.fr/fake#referenceWorksTitle> "Photochemistry: Volume 1" .\n',
        ])
            .pipe(ezs('ISTEXRemoveIf', {
                if: '<host/genre> = "journal"',
                remove: [
                    '<https://data.istex.fr/fake#bookTitle>',
                    '<https://data.istex.fr/fake#seriesTitle>',
                    '<https://data.istex.fr/fake#databaseTitle>',
                    '<https://data.istex.fr/fake#referenceWorksTitle>',
                ],
            }))
            .pipe(ezs('ISTEXRemoveIf', {
                if: '<host/genre> = "book-series"',
                remove: [
                    '<https://data.istex.fr/fake#journalTitle>',
                    '<https://data.istex.fr/fake#bookTitle>',
                    '<https://data.istex.fr/fake#databaseTitle>',
                    '<https://data.istex.fr/fake#referenceWorksTitle>',
                ],
            }))
            // .pipe(ezs('debug'))
            .on('data', (chunk) => {
                result = result.concat(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 2);
                assert(result[0].includes('<host/genre>'));
                assert(result[1].includes('seriesTitle'));
                done();
            });
    }).timeout(5000);

    it('ISTEXRemoveIf #4', (done) => {
        // When one document has a host/genre of "journal" and is followed by a
        // document of host/genre "book-series", and applying two RemoveIf, no
        // title remains.
        let result = [];
        from([
            `
            [ISTEX]
            id = 12B1EEFEDFB47AEE5533ABE42400727DA93056C7
            id = 961922E1FB4122B85B8ED048F7A9F8D611F463DD
            field = author
            field = title
            field = publicationDate
            field = host
            `,
        ])
            .pipe(ezs('ISTEXParseDotCorpus'))
            .pipe(ezs('OBJFlatten', { safe: false }))
            .pipe(ezs('ISTEXTriplify', {
                property: [
                    '^title -> http://purl.org/dc/terms/title',
                    '^author/\\d+/name -> http://purl.org/dc/terms/creator',
                    '^author/\\d+/affiliations -> https://data.istex.fr/ontology/istex#affiliation',
                    '^publicationDate -> http://purl.org/dc/terms/issued',
                    '^host/genre -> host/genre',
                    '^host/title -> https://data.istex.fr/fake#journalTitle',
                    '^host/title -> https://data.istex.fr/fake#bookTitle',
                    '^host/title -> https://data.istex.fr/fake#seriesTitle',
                    '^host/title -> https://data.istex.fr/fake#databaseTitle',
                    '^host/title -> https://data.istex.fr/fake#referenceWorksTitle',
                ],
            }))
            .pipe(ezs('ISTEXRemoveIf', {
                if: '<host/genre> = "journal"',
                remove: [
                    '<https://data.istex.fr/fake#bookTitle>',
                    '<https://data.istex.fr/fake#seriesTitle>',
                    '<https://data.istex.fr/fake#databaseTitle>',
                    '<https://data.istex.fr/fake#referenceWorksTitle>',
                ],
            }))
            // .pipe(ezs('debug', { text: 'remove1' }))
            .pipe(ezs('ISTEXRemoveIf', {
                if: '<host/genre> = "book-series"',
                remove: [
                    '<https://data.istex.fr/fake#journalTitle>',
                    '<https://data.istex.fr/fake#bookTitle>',
                    '<https://data.istex.fr/fake#databaseTitle>',
                    '<https://data.istex.fr/fake#referenceWorksTitle>',
                ],
            }))
            // .pipe(ezs('debug', { text: 'remove2' }))
            .on('data', (chunk) => {
                result = result.concat(chunk);
            })
            .on('end', () => {
                assert.equal(result.length, 17);
                assert(result[6].includes('<host/genre>'));
                assert(result[7].includes('journalTitle'));
                assert(result[15].includes('<host/genre>'));
                assert(result[16].includes('seriesTitle'));
                done();
            });
    }).timeout(5000);

    describe('ISTEXRemoveVerb', () => {
        it('should remove the triple including the verb', (done) => {
            let result = [];
            from([
                '<subject> <verb> <complement>',
            ])
                .pipe(ezs('ISTEXRemoveVerb', { verb: '<verb>' }))
                // .pipe(ezs('debug'))
                .on('data', (chunk) => {
                    result = result.concat(chunk);
                })
                .on('end', () => {
                    assert.equal(result.length, 0);
                    done();
                });
        });

        it('should remove the triple among two including the verb', (done) => {
            let result = [];
            from([
                '<subject> <verb> <complement> .',
                '<subject> <verb2> <complement> .',
            ])
                .pipe(ezs('ISTEXRemoveVerb', { verb: '<verb>' }))
                // .pipe(ezs('debug'))
                .on('data', (chunk) => {
                    result = result.concat(chunk);
                })
                .on('end', () => {
                    assert.equal(result.length, 1);
                    assert.equal(result[0], '<subject> <verb2> <complement> .\n');
                    done();
                });
        });

        it('should not remove any triple when the verb is not present', (done) => {
            let result = [];
            from([
                '<subject> <verb1> <complement> .',
                '<subject> <verb2> <complement> .',
            ])
                .pipe(ezs('ISTEXRemoveVerb', { verb: '<verb>' }))
                // .pipe(ezs('debug'))
                .on('data', (chunk) => {
                    result = result.concat(chunk);
                })
                .on('end', () => {
                    assert.equal(result.length, 2);
                    assert.equal(result[0], '<subject> <verb1> <complement> .\n');
                    assert.equal(result[1], '<subject> <verb2> <complement> .\n');
                    done();
                });
        });

        it('should remove all triples containing the verb', (done) => {
            let result = [];
            from([
                '<subject> <verb> <complement> .',
                '<subject> <verb1> <complement> .',
                '<subject> <verb> <complement> .',
                '<subject> <verb2> <complement> .',
                '<subject> <verb> <complement> .',
            ])
                .pipe(ezs('ISTEXRemoveVerb', { verb: '<verb>' }))
                // .pipe(ezs('debug'))
                .on('data', (chunk) => {
                    result = result.concat(chunk);
                })
                .on('end', () => {
                    assert.equal(result.length, 2);
                    assert.equal(result[0], '<subject> <verb1> <complement> .\n');
                    assert.equal(result[1], '<subject> <verb2> <complement> .\n');
                    done();
                });
        });
    });

    describe('ISTEXUniq', () => {
        it('should remove identical lines one after another', (done) => {
            let result = [];
            from([
                '<subject> <verb> <complement> .',
                '<subject> <verb> <complement> .',
            ])
                .pipe(ezs('ISTEXUniq'))
                // .pipe(ezs('debug'))
                .on('data', (chunk) => {
                    result = result.concat(chunk);
                })
                .on('end', () => {
                    assert.equal(result.length, 1);
                    assert.equal(result[0], '<subject> <verb> <complement> .\n');
                    done();
                });
        });

        it('should remove identical lines even if not following one another', (done) => {
            let result = [];
            from([
                '<subject> <verb> <complement> .',
                '<subject> <verb2> <complement2> .',
                '<subject> <verb> <complement> .',
            ])
                .pipe(ezs('ISTEXUniq'))
                // .pipe(ezs('debug'))
                .on('data', (chunk) => {
                    result = result.concat(chunk);
                })
                .on('end', () => {
                    assert.equal(result.length, 2);
                    assert.equal(result[0], '<subject> <verb> <complement> .\n');
                    assert.equal(result[1], '<subject> <verb2> <complement2> .\n');
                    done();
                });
        });

        it('should remove identical lines in two different subjects', (done) => {
            let result = [];
            from([
                '<subject1> <verb> <complement> .',
                '<subject1> <verb2> <complement2> .',
                '<subject1> <verb> <complement> .',
                '<subject2> <verb> <complement> .',
                '<subject2> <verb2> <complement2> .',
                '<subject2> <verb> <complement> .',
            ])
                .pipe(ezs('ISTEXUniq'))
                // .pipe(ezs('debug'))
                .on('data', (chunk) => {
                    result = result.concat(chunk);
                })
                .on('end', () => {
                    assert.equal(result.length, 4);
                    assert.equal(result[0], '<subject1> <verb> <complement> .\n');
                    assert.equal(result[1], '<subject1> <verb2> <complement2> .\n');
                    assert.equal(result[2], '<subject2> <verb> <complement> .\n');
                    assert.equal(result[3], '<subject2> <verb2> <complement2> .\n');
                    done();
                });
        });

        it('should remove identical lines in two different subjects when verbs are different', (done) => {
            let result = [];
            from([
                '<subject1> <verb> <complement> .',
                '<subject1> <verb2> <complement2> .',
                '<subject1> <verb> <complement> .',
                '<subject2> <verb2> <complement> .',
                '<subject2> <verb> <complement2> .',
                '<subject2> <verb2> <complement> .',
            ])
                .pipe(ezs('ISTEXUniq'))
                // .pipe(ezs('debug'))
                .on('data', (chunk) => {
                    result = result.concat(chunk);
                })
                .on('end', () => {
                    assert.equal(result.length, 4);
                    assert.equal(result[0], '<subject1> <verb> <complement> .\n');
                    assert.equal(result[1], '<subject1> <verb2> <complement2> .\n');
                    assert.equal(result[2], '<subject2> <verb2> <complement> .\n');
                    assert.equal(result[3], '<subject2> <verb> <complement2> .\n');
                    done();
                });
        });
    });
});
